import { PaperCardProps, PaperCardWithLink } from "@/components/paper-card";
import { CardBullet } from "@proemial/shadcn-ui";

type PaperCardAskProps = Omit<PaperCardProps, "header"> & {
	index: string;
	link: string;
};

export function PaperCardAsk({ index, ...rest }: PaperCardAskProps) {
	return (
		<PaperCardWithLink
			{...rest}
			header={<CardBullet variant="numbered">{index}</CardBullet>}
		/>
	);
}
