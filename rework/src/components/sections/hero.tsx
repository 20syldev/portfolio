import Image from "next/image";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { profile } from "@/data/profile";

export function Hero() {
    return (
        <Card className="card-hover">
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="shrink-0">
                    <Image
                        src="/images/logo.png"
                        alt={profile.name}
                        width={80}
                        height={80}
                        className="rounded-full border-3 border-border shadow-md"
                        priority
                    />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                    <div>
                        <h1 className="text-xl font-bold">{profile.name}</h1>
                        <p className="text-sm text-muted-foreground">{profile.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.description}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 sm:flex-col">
                    <Button asChild size="sm" variant="default">
                        <a
                            href={profile.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <a
                            href={profile.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Linkedin className="mr-2 h-4 w-4" />
                            LinkedIn
                        </a>
                    </Button>
                    <div className="flex gap-2">
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                            <a href={`mailto:${profile.links.email}`}>
                                <Mail className="h-4 w-4" />
                            </a>
                        </Button>
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                            <a href={profile.links.cv} download>
                                <FileText className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}