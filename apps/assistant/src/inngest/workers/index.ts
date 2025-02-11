import { scrapeTask } from "./annotate/scrape.task";
import { summarizeTask } from "./annotate/summarize.task";

export const workers = [scrapeTask.worker, summarizeTask.worker];

export const schedulers = [];
