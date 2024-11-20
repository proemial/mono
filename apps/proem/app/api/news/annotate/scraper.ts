import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";

export function scrapingDone(steps?: NewsAnnotatorSteps) {
	return !!steps?.summarise?.commentary?.length;
}
