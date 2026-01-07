import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileText, BookOpen } from "lucide-react";
import { profile } from "@/data/profile";
import Link from "next/link";

export function Social() {
    return (
        <Card className="h-full card-hover">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Liens</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Button asChild variant="outline" size="sm" className="justify-start">
                    <a
                        href={profile.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                    </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                    <a
                        href={profile.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                    </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                    <a href={`mailto:${profile.links.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
                    </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                    <a href={profile.links.cv} download>
                        <FileText className="mr-2 h-4 w-4" />
                        CV
                    </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                    <Link href="/veille">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Veille techno
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}