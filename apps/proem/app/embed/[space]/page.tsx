import { CollectionService } from "@/services/collection-service";
import { notFound } from "next/navigation";
import { SpacePapers } from "./space-papers";

// c1:AFD4145,c2:F8F8F8
type Props = {
	params: {
		space: string;
	};
	searchParams: {
		count?: number;
		nopadding?: boolean;
		foreground?: string;
		background?: string;
	};
};

export default async function EmbedPage({
	params: { space },
	searchParams: { count, background },
}: Props) {
	const collection = await CollectionService.getCollection(space);
	if (!collection) {
		notFound();
	}

	console.log("FEMTECH!!!");

	return (
		<div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"}>
			<SpacePapers
				space={space}
				count={count}
				background={background && `#${background}`}
				embedded
			/>
		</div>
	);
}
