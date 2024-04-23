import { CollapsibleSection } from "@/components/collapsible-section";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { Card, CardContent, Header4, Icons } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";

function PaperCardSkeleton() {
	return (
		<Card variant="paper">
			<CardContent className="flex justify-center items-center h-full">
				<Icons.loader className="size-4" />
			</CardContent>
		</Card>
	);
}

export function PaperReaderSkeleton() {
	return (
		<div className="space-y-6">
			<CollapsibleSection
				trigger={
					<div className="flex items-center gap-4">
						<File02 className="size-4" />
						<Header4>Research Paper</Header4>
					</div>
				}
			>
				<HorisontalScrollArea>
					<PaperCardSkeleton />
					<PaperCardSkeleton />
					<PaperCardSkeleton />
					<PaperCardSkeleton />
				</HorisontalScrollArea>
			</CollapsibleSection>
		</div>
	);
}
