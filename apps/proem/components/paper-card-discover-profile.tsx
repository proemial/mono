import {
	Button,
	Card,
	CardBullet,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@proemial/shadcn-ui";
import { Users } from "lucide-react";

export function PaperCardDiscoverProfile({ name }: { name: string }) {
	return (
		<Card variant="paper">
			<CardHeader>
				<CardBullet>
					<Users className="size-4" />
				</CardBullet>
				<CardDescription variant="paperDate">CO-AUTHOR</CardDescription>
			</CardHeader>
			<CardContent variant="paper">
				<div className="size-[72px] rounded-full mx-auto bg-primary" />
			</CardContent>
			<CardFooter>
				<CardDescription variant="paperCoAuthor">
					<Button variant="default" size="pill">
						{name}
					</Button>
				</CardDescription>
			</CardFooter>
		</Card>
	);
}
