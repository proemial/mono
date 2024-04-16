import { PaperCard, PaperCardProps } from "@/components/paper-card";
import { CardBullet } from "@proemial/shadcn-ui";
import { Globe01 } from "@untitled-ui/icons-react";

type PaperCardDiscoverProps = Omit<PaperCardProps, "header">;

export function PaperCardDiscover(props: PaperCardDiscoverProps) {
	return (
		<PaperCard
			{...props}
			header={
				<CardBullet>
					<Globe01 className="size-4" />
				</CardBullet>
			}
		/>
	);
}
