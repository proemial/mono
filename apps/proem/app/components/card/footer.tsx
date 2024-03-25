import { Concepts } from "@/app/components/card/concepts";
import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";

type Props = {
	data: OpenAlexWorkMetadata;
};

export function CardFooter({ data }: Props) {
	return (
		<Concepts data={data} />
	);
}
