import { PaperCard, PaperCardProps } from "@/components/paper-card";
import { CardBullet } from "@proemial/shadcn-ui";

type PaperCardAskProps = Omit<PaperCardProps, "header"> & {
	index: string;
};

export function PaperCardAsk({ index, ...rest }: PaperCardAskProps) {
	return (
		<PaperCard
			{...rest}
			header={<CardBullet variant="numbered">{index}</CardBullet>}
			fromTrackingKey="fromAsk"
		/>
	);
}
