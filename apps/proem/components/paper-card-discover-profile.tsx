import {
	Card,
	CardBullet,
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
				<CardDescription variant="paperDate">Author</CardDescription>
			</CardHeader>
			<div className="size-[72px] rounded-full mx-auto bg-primary my-5" />
			<CardFooter>
				<CardDescription
					variant="paperCoAuthor"
					className="truncate bg-primary px-4 py-2 rounded-full text-2xs text-nowrap"
				>
					{name}
				</CardDescription>
			</CardFooter>
		</Card>
	);
}
