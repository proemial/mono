import { NextRequest } from "next/server";
import sheetTopics from "./topics.json";
import subfieldsJson from "./subfields.json";

type SpreadsheetTopicEntry = {
	domain: string;
	field: string;
	subfield: string;
	topic: string;
	mappedTopic: string;
};

type SubfieldEntry = {
	id: string;
	display_name: string;
	domain: {
		id: string;
		display_name: string;
	};
	field: {
		id: string;
		display_name: string;
	};
};

type OutputEntry = {
	label: string;
	value?: string;
	children?: OutputEntry[];
};

export async function GET(req: NextRequest) {
	const topicsFromSheet = sheetTopics as {
		[id: string]: SpreadsheetTopicEntry;
	};
	const subfields = subfieldsJson as SubfieldEntry[];

	const entries: OutputEntry[] = [];

	for (const id of Object.keys(sheetTopics)) {
		const topic = topicsFromSheet[id] as SpreadsheetTopicEntry;
		// DOes not handle duplicate subfield names:
		// subfield:1303, 1311, 2737, 2404, 2728, 2736, 2209

		const subfield = (domainLabel: string, field: string) =>
			subfields.find(
				(e) =>
					e.display_name === topic.subfield &&
					e.domain.display_name === domainLabel &&
					e.field.display_name === field,
			) as SubfieldEntry;

		const withId = subfields.find(
			(e) => e.display_name === topic.subfield,
		) as SubfieldEntry;

		if (!entries.map((e) => e.label).includes(topic.domain)) {
			entries.push({
				label: topic.domain,
				value: `domain:${shortId(withId.domain.id)}`,
				children: [],
			});
		}

		const domainEntry = entries.find((e) => e.label === topic.domain);
		if (!domainEntry?.children?.map((e) => e.label).includes(topic.field)) {
			domainEntry?.children?.push({
				label: topic.field,
				value: `field:${shortId(withId.field.id)}`,
				children: [],
			});
		}

		const fieldEntry = domainEntry?.children?.find(
			(e) => e.label === topic.field,
		);
		if (!fieldEntry?.children?.map((e) => e.label).includes(topic.subfield)) {
			fieldEntry?.children?.push({
				label: topic.subfield,
				value: `subfield:${shortId(subfield(topic.domain, topic.field).id)}`,
				children: [],
			});
		}

		const subfieldEntry = fieldEntry?.children?.find(
			(e) => e.label === topic.subfield,
		);
		if (!subfieldEntry?.children?.map((e) => e.label).includes(topic.topic)) {
			subfieldEntry?.children?.push({
				label: topic.mappedTopic,
				value: `topic:${shortId(id)}`,
			});
		}
	}

	return Response.json(entries);
}

function shortId(id: string) {
	return id.substring(id.lastIndexOf("/") + 1);
}
