import { ReferencedPaper } from "../../redis/news";
import { Colors } from "../../googleapis/vision";

export interface ScrapedUrl {
	createdAt: Date;
	url: string;
	type?: "url" | "file";
	content: ScrapedContent;
	contentType?: string;
	openGraph?: OpenGraphData;
	summaries?: Summaries;
	references?: ReferencedPaper[];
	questions?: { question: string; answer: string }[];
}

export type SummaryKeys =
	| "query"
	| "background"
	| "engTitle"
	| "summary"
	| "questions"
	| "translatedTitle";
export type Summaries = Partial<
	Record<SummaryKeys, string | Array<{ question: string; answer: string }>>
>;

export interface ScrapedImage {
	naturalHeight: number;
	width: number;
	url: string;
	naturalWidth: number;
	primary: boolean;
	height: number;
}

export interface ScrapedContent {
	title: string;
	text: string;
	textVector?: number[];
	images?: ScrapedImage[];
	colors?: Colors;
}

export interface OpenGraphData {
	title?: string;
	description?: string;
	image?: string;
}
