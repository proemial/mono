import {
	Card,
	CardBullet,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@proemial/shadcn-ui";
import { Users01 } from "@untitled-ui/icons-react";

export function PaperCardDiscoverProfile({ name }: { name: string }) {
	return (
		<Card variant="paper">
			<CardHeader>
				<CardBullet>
					<Users01 className="size-4" />
				</CardBullet>
				<CardDescription variant="paperDate">CO-AUTHOR</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="size-[72px] rounded-full mx-auto bg-primary" />
			</CardContent>
			<CardFooter>
				<CardDescription variant="paperCoAuthor" className="truncate">
					<div className="truncate bg-primary px-4 py-2 rounded-full text-2xs">
						{name}
					</div>
				</CardDescription>
			</CardFooter>
		</Card>
	);
}
