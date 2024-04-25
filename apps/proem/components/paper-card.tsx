import {
	analyticsKeys,
	trackHandler,
} from "@/app/components/analytics/tracking/tracking-keys";
import { toTitleCaseIfAllCaps } from "@/utils/string-utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Icons,
} from "@proemial/shadcn-ui";
import Link from "next/link";

export type PaperCardProps = {
	date?: string;
	header: React.ReactNode;
	loading?: boolean;
	publisher?: string;
	title: string;
};

export function PaperCard({
	date,
	title,
	publisher,
	header,
	loading,
}: PaperCardProps) {
	return (
		<Card variant="paper">
			<CardHeader>
				{header}
				<CardDescription variant="paperDate">
					{date?.replaceAll("-", ".")}
				</CardDescription>
			</CardHeader>

			{loading ? (
				<div className="flex items-center justify-center mx-auto size-24">
					<Icons.loader />
				</div>
			) : (
				<CardTitle variant="paper" className="line-clamp-4  mb-3.5 mt-4">
					{title}
				</CardTitle>
			)}

			{publisher && (
				<CardDescription variant="paperPublisher" className="line-clamp-2">
					{publisher}
				</CardDescription>
			)}
		</Card>
	);
}

// Created just to test navigation between Ask and Read - delete once Read works!
export function PaperCardWithLink({
	date,
	title,
	publisher,
	header,
	loading,
	link,
}: PaperCardProps & { link: string }) {
	return (
		<Link href={link} onClick={trackHandler(analyticsKeys.ask.click.paper)}>
			<Card variant="paper">
				<CardHeader>
					{header}
					<CardDescription variant="paperDate">
						{date?.replaceAll("-", ".")}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{loading ? (
						<div className="flex items-center justify-center mx-auto size-24">
							<Icons.loader />
						</div>
					) : (
						<CardTitle variant="paper" className="line-clamp-4">
							{toTitleCaseIfAllCaps(title)}
						</CardTitle>
					)}
				</CardContent>

				{publisher && (
					<CardFooter>
						<CardDescription variant="paperPublisher">
							{publisher}
						</CardDescription>
					</CardFooter>
				)}
			</Card>
		</Link>
	);
}
