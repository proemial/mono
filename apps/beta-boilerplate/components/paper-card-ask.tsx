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
import { Icons } from "@/components/ui/icons";


interface PaperCardAskProps {
    paper?: Paper;
    cardKey?: React.Key;
    index?: string;
}

export function PaperCardAsk({ paper, cardKey, index }: PaperCardAskProps) {
    return (
        <Card key={cardKey} variant="paper">
            <CardHeader variant="paperAsk">
                <CardBullet variant="numbered">{index}</CardBullet>
                {paper && <CardDescription variant="paperDate">{paper.date}</CardDescription>}
            </CardHeader>
            <CardContent variant="paperAsk">
                {paper && <CardTitle variant="paper">{paper.title}</CardTitle>}
                {!paper &&
                    <div className="flex mx-auto size-24 items-center justify-center">
                        <Icons.loader /></div>
                }
            </CardContent>
            {paper && <CardFooter>
                <CardDescription variant="paperPublisher">{paper.publisher}</CardDescription>
            </CardFooter>}
        </Card>
    );
}