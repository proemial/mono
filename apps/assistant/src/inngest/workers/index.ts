import { fetchTask } from "./annotate/4-fetch.task";
import { queryTask } from "./annotate/2-summarize.task";
import { scrapeTask } from "./annotate/1-scrape.task";
import { summarizeTask } from "./annotate/5-annotate.task";
import { slackAskResponseTask } from "./ask/2-slack.task";
import { slackAnnotateResponseTask } from "./annotate/3-slack.task";
import { askTask } from "./ask/1-summarize.task";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";

export const workers = [
	scrapeTask.worker,
	queryTask.worker,
	fetchTask.worker,
	summarizeTask.worker,
	slackAnnotateResponseTask.worker,
	slackAskResponseTask.worker,
	askTask.worker,
];

export const schedulers = [];

export type SlackAnnotateEvent = {
	url: string;
	metadata: SlackEventMetadata;
};

export type SlackAskEvent = {
	thread: string;
	question: string;
	answer: string;
	metadata?: SlackEventMetadata;
};
