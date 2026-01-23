"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface VideoProps {
    src: string;
    title: string;
    className?: string;
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function Video({ src, title, className }: VideoProps) {
    const [open, setOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [hasAudio, setHasAudio] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const thumbnailRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Handle dialog open/close
    const handleOpenChange = useCallback((isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            thumbnailRef.current?.pause();
        } else {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
            setIsPlaying(false);
            setCurrentTime(0);
            thumbnailRef.current?.play().catch(() => {});
        }
    }, []);

    // Auto-play when dialog opens
    useEffect(() => {
        if (open && videoRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        }
    }, [open]);

    // Play/Pause toggle
    const togglePlay = useCallback(() => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, []);

    // Volume control
    const toggleMute = useCallback(() => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(!isMuted);
    }, [isMuted]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const newVolume = parseFloat(e.target.value);
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    }, []);

    // Fullscreen
    const toggleFullscreen = useCallback(async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch {}
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Progress bar seek
    const handleProgressClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!videoRef.current || !progressRef.current) return;
            const rect = progressRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * duration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        },
        [duration]
    );

    // Progress bar drag
    const handleProgressDrag = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!videoRef.current || !progressRef.current || !isDragging) return;
            const rect = progressRef.current.getBoundingClientRect();
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const newTime = percent * duration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        },
        [duration, isDragging]
    );

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleProgressDrag);
            document.addEventListener("mouseup", handleDragEnd);
            document.addEventListener("touchmove", handleProgressDrag);
            document.addEventListener("touchend", handleDragEnd);
        }
        return () => {
            document.removeEventListener("mousemove", handleProgressDrag);
            document.removeEventListener("mouseup", handleDragEnd);
            document.removeEventListener("touchmove", handleProgressDrag);
            document.removeEventListener("touchend", handleDragEnd);
        };
    }, [isDragging, handleProgressDrag, handleDragEnd]);

    // Auto-hide controls
    const resetControlsTimeout = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) {
            setShowControls(true);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        } else {
            resetControlsTimeout();
        }
    }, [isPlaying, resetControlsTimeout]);

    // Smooth progress bar update
    useEffect(() => {
        const updateProgress = () => {
            if (videoRef.current && !isDragging && isPlaying) {
                setCurrentTime(videoRef.current.currentTime);
                animationFrameRef.current = requestAnimationFrame(updateProgress);
            }
        };

        if (isPlaying && !isDragging) {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, isDragging]);

    // Video event handlers
    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current && !isDragging) {
            setCurrentTime(videoRef.current.currentTime);
        }
    }, [isDragging]);

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            // Detect if video has audio track
            const video = videoRef.current as HTMLVideoElement & {
                mozHasAudio?: boolean;
                webkitAudioDecodedByteCount?: number;
                audioTracks?: { length: number };
            };
            const hasAudioTrack =
                video.mozHasAudio ||
                Boolean(video.webkitAudioDecodedByteCount) ||
                Boolean(video.audioTracks?.length);
            setHasAudio(hasAudioTrack);
        }
    }, []);

    const handlePlay = useCallback(() => setIsPlaying(true), []);
    const handlePause = useCallback(() => setIsPlaying(false), []);

    const handleEnded = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    }, []);

    // Keyboard controls
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                togglePlay();
            } else if (e.code === "KeyF") {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.code === "KeyM") {
                e.preventDefault();
                toggleMute();
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                }
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(
                        duration,
                        videoRef.current.currentTime + 5
                    );
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, togglePlay, toggleFullscreen, toggleMute, duration]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {/* Trigger - Video Thumbnail */}
            <DialogPrimitive.Trigger asChild>
                <button
                    className={cn(
                        "group relative w-full cursor-pointer overflow-hidden rounded-lg border",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "outline-none transition-shadow hover:shadow-lg",
                        className
                    )}
                    aria-label={`Lire la vidéo: ${title}`}
                >
                    <video ref={thumbnailRef} autoPlay muted loop playsInline className="w-full">
                        <source src={src} type="video/mp4" />
                    </video>

                    {/* Hover overlay - expand icon */}
                    <div
                        className={cn(
                            "absolute inset-0 flex items-center justify-center",
                            "bg-black/0 transition-all duration-200",
                            "opacity-0 group-hover:opacity-100 group-hover:bg-black/30"
                        )}
                    >
                        <div
                            className={cn(
                                "flex items-center justify-center rounded-full",
                                "h-12 w-12 sm:h-14 sm:w-14",
                                "bg-white/90 text-black shadow-lg",
                                "transition-transform duration-200",
                                "scale-90 group-hover:scale-100"
                            )}
                        >
                            <Maximize className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                    </div>
                </button>
            </DialogPrimitive.Trigger>

            {/* Dialog Content */}
            <DialogPortal>
                <DialogOverlay className="bg-black/90 backdrop-blur-sm" />
                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    className={cn(
                        "fixed z-50 bg-black",
                        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
                        "rounded-xl overflow-hidden",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "duration-200"
                    )}
                >
                    <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>

                    {/* Video container - adapts to video size */}
                    <div
                        ref={containerRef}
                        className={cn(
                            "relative bg-black",
                            isFullscreen && "w-screen h-screen flex items-center justify-center"
                        )}
                        onClick={togglePlay}
                        onMouseMove={resetControlsTimeout}
                        onTouchStart={resetControlsTimeout}
                        onTouchEnd={resetControlsTimeout}
                    >
                        {/* Close button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                            }}
                            className={cn(
                                "absolute top-2 right-2 z-20",
                                "flex h-8 w-8 items-center justify-center rounded-full",
                                "bg-black/50 text-white backdrop-blur-sm",
                                "hover:bg-black/70 transition-all",
                                "focus-visible:ring-2 focus-visible:ring-white",
                                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                            )}
                            aria-label="Fermer"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <video
                            ref={videoRef}
                            playsInline
                            className={cn(
                                "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] block",
                                isFullscreen && "max-w-full max-h-full w-auto h-auto"
                            )}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onEnded={handleEnded}
                        >
                            <source src={src} type="video/mp4" />
                            Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>

                        {/* Center pause indicator */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                                    <Pause className="h-8 w-8 text-white" fill="currentColor" />
                                </div>
                            </div>
                        )}

                        {/* Custom Controls */}
                        <div
                            className={cn(
                                "absolute bottom-0 left-0 right-0 p-4 pt-8",
                                "bg-gradient-to-t from-black/80 to-transparent",
                                "transition-opacity duration-300",
                                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                            )}
                        >
                            {/* Progress bar */}
                            <div
                                ref={progressRef}
                                className="relative h-1.5 bg-white/30 rounded-full cursor-pointer mb-3 group/progress"
                                onClick={handleProgressClick}
                                onMouseDown={handleDragStart}
                                onTouchStart={handleDragStart}
                            >
                                {/* Progress fill */}
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                                {/* Drag handle */}
                                <div
                                    className={cn(
                                        "absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5",
                                        "bg-white rounded-full shadow-md",
                                        "opacity-0 group-hover/progress:opacity-100 transition-opacity",
                                        isDragging && "opacity-100"
                                    )}
                                    style={{ left: `calc(${progress}% - 7px)` }}
                                />
                            </div>

                            {/* Controls row */}
                            <div className="flex items-center gap-3 text-white">
                                {/* Play/Pause */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePlay();
                                    }}
                                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    aria-label={isPlaying ? "Pause" : "Lecture"}
                                >
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        {isPlaying ? (
                                            <Pause className="h-5 w-5" fill="currentColor" />
                                        ) : (
                                            <Play className="h-5 w-5" fill="currentColor" />
                                        )}
                                    </span>
                                </button>

                                {/* Time */}
                                <span className="text-sm font-mono tabular-nums">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>

                                <div className="flex-1" />

                                {/* Volume (hidden on mobile, disabled if no audio) */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                "hidden sm:flex items-center gap-2",
                                                !hasAudio && "opacity-40"
                                            )}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (hasAudio) toggleMute();
                                                }}
                                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                                aria-label={
                                                    !hasAudio
                                                        ? "Pas de son"
                                                        : isMuted
                                                          ? "Activer le son"
                                                          : "Couper le son"
                                                }
                                            >
                                                {!hasAudio || isMuted || volume === 0 ? (
                                                    <VolumeX className="h-5 w-5" />
                                                ) : (
                                                    <Volume2 className="h-5 w-5" />
                                                )}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-20 h-1 accent-white cursor-pointer"
                                                aria-label="Volume"
                                                disabled={!hasAudio}
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    {!hasAudio && (
                                        <TooltipContent>
                                            <p>Cette vidéo n'a pas de son</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>

                                {/* Fullscreen */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFullscreen();
                                    }}
                                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    aria-label={
                                        isFullscreen ? "Quitter le plein écran" : "Plein écran"
                                    }
                                >
                                    {isFullscreen ? (
                                        <Minimize className="h-5 w-5" />
                                    ) : (
                                        <Maximize className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}