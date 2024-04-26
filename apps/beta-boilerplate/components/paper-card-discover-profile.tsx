import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardBullet,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { Button } from "./ui/button";

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
