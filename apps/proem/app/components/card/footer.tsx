import { Concepts } from "@/app/components/card/concepts";
import { FeatureKey } from "@/app/components/feature-flags/features";
import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { Topics } from "./topics";

type Props = {
	data: OpenAlexWorkMetadata;
	flags: { [key in FeatureKey]?: boolean };
};

export function CardFooter({ data, flags }: Props) {
	// topics["https://openalex.org/T10001"]["short-name"]
	return (
		<>
			{flags.cardShowShortenedTopics && (
				<Topics topics={data.topics} />
			)}
			{!flags.cardShowShortenedTopics && <Concepts data={data} />}
		</>
	);
}
