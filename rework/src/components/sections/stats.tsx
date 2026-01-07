import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWebsiteData } from "@/lib/api";
import { Activity } from "lucide-react";

export async function Stats() {
    const data = await getWebsiteData();
    const stats = data?.stats;

    return (
        <Card className="h-full card-hover">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4 text-primary" />
                    Expérience
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Front-End</span>
                    <span className="font-medium">{stats?.frontend || "8 ans"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Back-End</span>
                    <span className="font-medium">{stats?.backend || "5 ans"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Ce mois</span>
                    <span className="font-medium">{stats?.this_month || "~100"} contributions</span>
                </div>
            </CardContent>
        </Card>
    );
}