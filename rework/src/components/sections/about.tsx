import { GraduationCap, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profile } from "@/data/profile";
import Link from "next/link";

export function About() {
    return (
        <>
            {/* Formation */}
            <Card className="h-full card-hover">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        Formation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p className="font-medium">{profile.education.school}</p>
                    <p className="text-muted-foreground">
                        {profile.education.degree} ({profile.education.duration})
                    </p>
                </CardContent>
            </Card>

            {/* Alternance */}
            <Card className="h-full card-hover">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Alternance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p className="font-medium">{profile.work.company}</p>
                    <p className="text-muted-foreground">{profile.work.role}</p>
                    <Link
                        href="/alternance"
                        className="inline-block text-xs text-primary hover:underline"
                    >
                        Voir les projets →
                    </Link>
                </CardContent>
            </Card>
        </>
    );
}