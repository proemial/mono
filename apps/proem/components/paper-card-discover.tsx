import { PaperCard, PaperCardProps } from "@/components/paper-card";
import { CardBullet } from "@proemial/shadcn-ui";
import { LinkExternal01 } from "@untitled-ui/icons-react";

export type PaperCardDiscoverProps = Omit<
	PaperCardProps,
	"header" | "bookmarks" | "paperId"
>;

export function PaperCardDiscover(props: PaperCardDiscoverProps) {
	return (
		<PaperCard
			{...props}
			header={
				<CardBullet>
					<LinkExternal01 className="size-4" />
				</CardBullet>
			}
		/>
	);
}
