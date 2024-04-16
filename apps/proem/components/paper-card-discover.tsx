import { PaperCard, PaperCardProps } from "@/components/paper-card";
import { CardBullet } from "@proemial/shadcn-ui";
import { Globe } from "lucide-react";

type PaperCardDiscoverProps = Omit<PaperCardProps, "header">;

export function PaperCardDiscover(props: PaperCardDiscoverProps) {
	return (
		<PaperCard
			{...props}
			header={
				<CardBullet>
					<Globe className="size-4" />
				</CardBullet>
			}
		/>
	);
}
