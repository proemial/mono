import { fetchTask } from "./annotate/fetch.task";
import { queryTask } from "./annotate/query.task";
import { scrapeTask } from "./annotate/scrape.task";
import { summarizeTask } from "./annotate/summarize.task";
import { slackAnnotateResponseTask } from "./routing/slack-annotate.task";
import { slackAskResponseTask } from "./routing/slack-ask.task";
import { askTask } from "./ask/summarize.task";

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
