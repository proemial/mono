import { oaFieldConfigMap } from "@/app/data/oa-fields";
import { OpenAlexTopic } from "@proemial/repositories/oa/models/oa-paper";

export function getFieldFromOpenAlexTopics(topics: OpenAlexTopic[]) {
	if (topics.length === 0) {
		return null;
	}

	const field = topics.reduce((prev, current) =>
		prev.score > current.score ? prev : current,
	);

	return oaFieldConfigMap[field.field.id];
}
