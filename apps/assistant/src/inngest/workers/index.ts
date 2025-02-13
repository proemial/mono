import { fetchTask } from "./annotate/4-fetch.task";
import { queryTask } from "./annotate/2-summarize.task";
import { scrapeTask } from "./annotate/1-scrape.task";
import { summarizeTask } from "./annotate/5-annotate.task";
import { slackAnnotateResponseTask } from "./ask/2-slack.task";
import { slackAskResponseTask } from "./annotate/3-slack.task";
import { askTask } from "./ask/1-summarize.task";

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
