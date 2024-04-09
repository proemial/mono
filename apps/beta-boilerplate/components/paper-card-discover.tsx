import {
    Card,
    CardBullet,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { Paper } from "@/lib/definitions";
import { Globe } from "lucide-react";

export function PaperCardDiscover({ paper }: { paper: Paper }) {
    return (
        <Card variant="paper">
            <CardHeader variant="paperDiscover">
                <CardBullet><Globe className="size-4" /></CardBullet>
                <CardDescription variant="paperDate">{paper.date}</CardDescription>
            </CardHeader >
            <CardContent variant="paper">
                <CardTitle variant="paper">{paper.title}</CardTitle>
            </CardContent>
            <CardFooter>
                <CardDescription variant="paperPublisher">{paper.publisher}</CardDescription>
            </CardFooter>
        </Card >
    );
}