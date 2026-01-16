"use client";

import { useEffect, useState } from "react";
import { skills } from "@/data/profile";

export function Skills() {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="py-12">
            <h2 className="mb-2 text-center text-2xl font-bold">Compétences</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
                Auto-évaluation par rapport à la compréhension d&apos;un code en
                %
            </p>

            <div className="mx-auto max-w-2xl space-y-6">
                {skills.map((skill, index) => (
                    <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground">
                                {skill.level}%
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                                style={{
                                    width: animated ? `${skill.level}%` : "0%",
                                    transitionDelay: `${index * 100}ms`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}