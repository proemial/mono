import { OpenAlexTopic, OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { ConceptBoxes } from "./concepts";
import oaTopics from "../../data/oa-topics-compact.json";

type Props = {
	topics?: OpenAlexTopic[];
};

export function Topics({ topics }: Props) {
	return (
		<ConceptBoxes concepts={topics?.map((topic) => oaTopics[topic.id as keyof typeof oaTopics]['short-name']) || []} />
	);
}