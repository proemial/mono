export interface ScrapedUrl {
	createdAt: Date;
	url: string;
	contentType?: string;
	openGraph?: OpenGraphData;
	content: ScrapedContent;
}

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
	images: ScrapedImage[];
}

export interface OpenGraphData {
	title?: string;
	description?: string;
	image?: string;
}
