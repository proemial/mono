import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";

export type SlackAnnotateEvent = {
	url: string;
	metadata?: SlackEventMetadata;
};
