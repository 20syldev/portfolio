"use client";

import { useEffect, useRef } from "react";

interface PhysicsOptions {
    friction?: number;
    springStiffness?: number;
    springDamping?: number;
    bounceFactor?: number;
    snapDistance?: number;
    snapThreshold?: number;
    onAllEdges?: (rect: DOMRect) => boolean;
}

interface PointerSample {
    x: number;
    y: number;
    time: number;
}

const defaults = {
    friction: 0.985, // Slide distance (0–1)
    springStiffness: 0.003, // Return speed
    springDamping: 0.08, // Oscillation reduction (0–1)
    bounceFactor: 0.6, // Edge bounce energy (0–1)
    snapDistance: 60, // Snap-back radius (px)
    snapThreshold: 5, // Snap-back max speed (px/frame)
};

const rotation = {
    // Drag pendulum
    dragTorqueScale: 0.12, // Drag-to-rotation strength
    dragSpringStiffness: 0.03, // Pull toward target angle
    dragDamping: 0.9, // Swing smoothing (0–1)
    // Free flight
    flightStiffness: 0.08, // Pull back to 0°
    flightDamping: 0.92, // Spin decay (0–1)
    flightVelocityCoupling: 0.15, // Velocity-to-tilt
    // Snap-back
    snapStiffness: 0.15, // Return spring force
    snapDamping: 0.85, // Angular damping (0–1)
    snapFriction: 0.7, // Position damping (0–1)
};

/**
 * Hook that adds draggable physics to an element.
 * Uses separate CSS translate/rotate properties so transform-origin
 * only affects rotation (not translation). Grab point = pivot.
 */
export function useDraggablePhysics(options?: PhysicsOptions) {
    const config = { ...defaults, ...options };
    const ref = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const settleRef = useRef<(() => void) | null>(null);
    const configRef = useRef(config);

    useEffect(() => {
        configRef.current = config;
    });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let x = 0,
            y = 0,
            vx = 0,
            vy = 0;
        let angle = 0,
            av = 0;
        let targetAngle = 0;
        let dragging = false;
        let animId: number | undefined;
        let dragAnimId: number | undefined;
        let dragStartMx = 0,
            dragStartMy = 0,
            dragStartOx = 0,
            dragStartOy = 0;
        let prevDragX = 0;

        const samples: PointerSample[] = [];

        let originRect: DOMRect | null = null;
        let edgesHit = 0;
        let firstEdgeTime = 0;

        const apply = () => {
            el.style.translate = `${x}px ${y}px`;
            el.style.rotate = `${angle}deg`;
        };

        const cacheOrigin = () => {
            const rect = el.getBoundingClientRect();
            originRect = new DOMRect(rect.x - x, rect.y - y, rect.width, rect.height);
        };

        const stop = () => {
            if (animId !== undefined) {
                cancelAnimationFrame(animId);
                animId = undefined;
            }
            if (dragAnimId !== undefined) {
                cancelAnimationFrame(dragAnimId);
                dragAnimId = undefined;
            }
        };

        const settle = () => {
            x = y = vx = vy = angle = av = 0;
            el.style.translate = "";
            el.style.rotate = "";
            el.style.transformOrigin = "";
            el.style.willChange = "auto";
            animId = undefined;
        };
        settleRef.current = settle;

        const dragPendulum = () => {
            if (!dragging) return;

            const dx = x - prevDragX;
            prevDragX = x;
            const moveTorque = dx * rotation.dragTorqueScale;

            const diff = targetAngle - angle;
            av += diff * rotation.dragSpringStiffness + moveTorque;
            av *= rotation.dragDamping;
            angle += av;

            apply();
            dragAnimId = requestAnimationFrame(dragPendulum);
        };

        const animateLoop = () => {
            const c = configRef.current;
            const origin = originRect;
            if (!origin) return;

            const fx = -c.springStiffness * x;
            const fy = -c.springStiffness * y;
            vx = (vx + fx) * c.friction - c.springDamping * vx;
            vy = (vy + fy) * c.friction - c.springDamping * vy;
            x += vx;
            y += vy;

            av += -rotation.flightStiffness * angle;
            av *= rotation.flightDamping;
            av += vx * rotation.flightVelocityCoupling;
            angle += av;

            const left = origin.left + x;
            const right = left + origin.width;
            const top = origin.top + y;
            const bottom = top + origin.height;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            let hitEdge = 0;
            if (left < 0) {
                x = -origin.left;
                vx = Math.abs(vx) * c.bounceFactor;
                hitEdge |= 1;
            } else if (right > vw) {
                x = vw - origin.left - origin.width;
                vx = -Math.abs(vx) * c.bounceFactor;
                hitEdge |= 2;
            }
            if (top < 0) {
                y = -origin.top;
                vy = Math.abs(vy) * c.bounceFactor;
                hitEdge |= 4;
            } else if (bottom > vh) {
                y = vh - origin.top - origin.height;
                vy = -Math.abs(vy) * c.bounceFactor;
                hitEdge |= 8;
            }

            if (hitEdge) {
                const now = performance.now();
                if (!edgesHit) firstEdgeTime = now;
                edgesHit |= hitEdge;
                if (edgesHit === 15 && now - firstEdgeTime < 1000) {
                    if (c.onAllEdges?.(el.getBoundingClientRect())) {
                        stop();
                        return;
                    }
                }
                if (now - firstEdgeTime >= 1000) {
                    edgesHit = hitEdge;
                    firstEdgeTime = now;
                }
            }

            if (
                Math.abs(vx) + Math.abs(vy) < 0.1 &&
                Math.abs(x) + Math.abs(y) < 0.5 &&
                Math.abs(angle) < 0.3 &&
                Math.abs(av) < 0.1
            ) {
                settle();
                return;
            }

            apply();
            animId = requestAnimationFrame(animateLoop);
        };

        const snapLoop = () => {
            vx = (vx + -rotation.snapStiffness * x) * rotation.snapFriction;
            vy = (vy + -rotation.snapStiffness * y) * rotation.snapFriction;
            x += vx;
            y += vy;

            av += -rotation.snapStiffness * angle;
            av *= rotation.snapDamping;
            angle += av;

            if (
                Math.abs(x) + Math.abs(y) < 0.5 &&
                Math.abs(vx) + Math.abs(vy) < 0.1 &&
                Math.abs(angle) < 0.3
            ) {
                settle();
                return;
            }

            apply();
            animId = requestAnimationFrame(snapLoop);
        };

        const computeVelocity = () => {
            if (samples.length < 2) return { vx: 0, vy: 0 };
            const now = samples[samples.length - 1];
            const start = samples.findLast((s) => now.time - s.time >= 80) ?? samples[0];
            const dt = now.time - start.time;
            if (dt === 0) return { vx: 0, vy: 0 };
            const scale = 16.67 / dt;
            return { vx: (now.x - start.x) * scale, vy: (now.y - start.y) * scale };
        };

        cacheOrigin();

        const noMotion = () => document.body.classList.contains("no-motion");

        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0 || noMotion()) return;
            e.preventDefault();
            el.setPointerCapture(e.pointerId);

            stop();
            dragging = true;
            draggingRef.current = true;
            edgesHit = 0;
            firstEdgeTime = 0;
            el.style.cursor = "grabbing";
            el.style.willChange = "translate, rotate";

            angle = 0;
            av = 0;
            el.style.rotate = "0deg";
            el.style.transformOrigin = "";

            const rect = el.getBoundingClientRect();

            const ox = e.clientX - rect.left;
            const oy = e.clientY - rect.top;
            el.style.transformOrigin = `${ox}px ${oy}px`;

            const dx = rect.width / 2 - ox;
            const dy = rect.height / 2 - oy;
            targetAngle = Math.atan2(dx, dy) * (180 / Math.PI);

            dragStartMx = e.clientX;
            dragStartMy = e.clientY;
            dragStartOx = x;
            dragStartOy = y;
            samples.length = 0;
            samples.push({ x: e.clientX, y: e.clientY, time: performance.now() });

            prevDragX = x;

            cacheOrigin();
            dragAnimId = requestAnimationFrame(dragPendulum);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!dragging) return;

            x = dragStartOx + (e.clientX - dragStartMx);
            y = dragStartOy + (e.clientY - dragStartMy);

            samples.push({ x: e.clientX, y: e.clientY, time: performance.now() });
            if (samples.length > 5) samples.shift();

            apply();
        };

        const onPointerUp = () => {
            if (!dragging) return;
            dragging = false;
            draggingRef.current = false;
            el.style.cursor = "grab";

            if (dragAnimId !== undefined) {
                cancelAnimationFrame(dragAnimId);
                dragAnimId = undefined;
            }

            const c = configRef.current;
            const dist = Math.sqrt(x * x + y * y);
            const vel = computeVelocity();
            const speed = Math.sqrt(vel.vx * vel.vx + vel.vy * vel.vy);

            vx = vel.vx;
            vy = vel.vy;

            if (dist < c.snapDistance && speed < c.snapThreshold) {
                animId = requestAnimationFrame(snapLoop);
            } else {
                animId = requestAnimationFrame(animateLoop);
            }
        };

        let resizeRaf: number | undefined;
        const onResize = () => {
            if (resizeRaf !== undefined) return;
            resizeRaf = requestAnimationFrame(() => {
                resizeRaf = undefined;
                cacheOrigin();
            });
        };

        const applyInteractive = (on: boolean) => {
            el.style.cursor = on ? "grab" : "";
            el.style.touchAction = on ? "none" : "";
            el.style.userSelect = on ? "none" : "";
        };

        applyInteractive(!noMotion());

        const observer = new MutationObserver(() => {
            const off = noMotion();
            applyInteractive(!off);
            if (off && dragging) {
                dragging = false;
                draggingRef.current = false;
                stop();
                settle();
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

        const onTouchStart = (e: TouchEvent) => {
            if (noMotion()) return;
            e.stopPropagation();
        };

        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
        window.addEventListener("resize", onResize);

        return () => {
            observer.disconnect();
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
            window.removeEventListener("resize", onResize);
            if (resizeRaf !== undefined) cancelAnimationFrame(resizeRaf);
            stop();
            el.style.translate = "";
            el.style.rotate = "";
            el.style.transformOrigin = "";
            el.style.willChange = "";
            el.style.cursor = "";
            el.style.touchAction = "";
            el.style.userSelect = "";
        };
    }, []);

    return { ref, isDragging: draggingRef, settle: settleRef };
}