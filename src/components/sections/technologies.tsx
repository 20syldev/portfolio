import { Badge } from "@/components/ui/badge";
import { technologies } from "@/data/profile";

export function Technologies() {
    return (
        <section className="py-12">
            <h2 className="mb-8 text-center text-2xl font-bold">
                Technologies
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
                {technologies.map((tech) => (
                    <Badge
                        key={tech.name}
                        variant="outline"
                        className="px-4 py-2 text-sm transition-all hover:scale-105"
                        style={{
                            borderColor: tech.color,
                            color: tech.color,
                        }}
                    >
                        {tech.name}
                    </Badge>
                ))}
            </div>
        </section>
    );
}