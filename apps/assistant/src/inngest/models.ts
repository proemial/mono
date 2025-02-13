import { SlackEventMetadata } from "@proemial/adapters/slack/metadata.models";

export type SlackAnnotateEvent = {
	url: string;
	metadata?: SlackEventMetadata;
};

export type SlackAskEvent = {
	thread: string;
	question: string;
	answer: string;
	metadata?: SlackEventMetadata;
};
