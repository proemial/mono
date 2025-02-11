import { fetchTask } from "./annotate/fetch.task";
import { queryTask } from "./annotate/query.task";
import { scrapeTask } from "./annotate/scrape.task";
import { summarizeTask } from "./annotate/summarize.task";
import { slackTask } from "./routing/slack.task";

export const workers = [
	scrapeTask.worker,
	queryTask.worker,
	fetchTask.worker,
	summarizeTask.worker,
	slackTask.worker,
];

export const schedulers = [];
