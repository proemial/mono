import { ReferencedPaper } from "../../redis/news";
import { Colors } from "../../googleapis/vision";

export interface ScrapedUrl {
	createdAt: Date;
	url: string;
	content: ScrapedContent;
	contentType?: string;
	openGraph?: OpenGraphData;
	summaries?: Summaries;
	references?: ReferencedPaper[];
	questions?: { question: string; answer: string }[];
}

export type SummaryKeys = "query" | "background" | "engTitle";
export type Summaries = Partial<Record<SummaryKeys, string>>;

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
	images?: ScrapedImage[];
	colors?: Colors;
}

export interface OpenGraphData {
	title?: string;
	description?: string;
	image?: string;
}
