import {
	Avatar,
	AvatarFallback,
	AvatarImage,
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
			<CardHeader variant="paperDiscover">
				<CardBullet>
					<Users className="size-4" />
				</CardBullet>
				<CardDescription variant="paperDate">CO-AUTHOR</CardDescription>
			</CardHeader>
			<CardContent variant="paper">
				<Avatar className="size-[72px] mx-auto">
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
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
