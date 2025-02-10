// Union type of all possible Diffbot response types
export type DiffbotResponseType =
	| DiffbotArticleResponse
	| DiffbotDiscussionResponse
	| DiffbotEventResponse
	| DiffbotJobResponse
	| DiffbotListResponse
	| DiffbotOrganizationResponse
	| DiffbotProductResponse
	| DiffbotVideoResponse;

// Type helper for specific Diffbot response types
export type DiffbotArticleResponse = DiffbotResponse<DiffbotArticleObject>;
export type DiffbotDiscussionResponse =
	DiffbotResponse<DiffbotDiscussionObject>;
export type DiffbotEventResponse = DiffbotResponse<DiffbotEventObject>;
export type DiffbotJobResponse = DiffbotResponse<DiffbotJobObject>;
export type DiffbotListResponse = DiffbotResponse<DiffbotListObject>;
export type DiffbotOrganizationResponse =
	DiffbotResponse<DiffbotOrganizationObject>;
export type DiffbotProductResponse = DiffbotResponse<DiffbotProductObject>;
export type DiffbotVideoResponse = DiffbotResponse<DiffbotVideoObject>;

// Main response type that combines all possible Diffbot responses
export interface DiffbotResponse<T> extends DiffbotResponseBase {
	objects: T[];
}

// Base interface for all Diffbot responses
interface DiffbotResponseBase {
	request: {
		options: unknown[];
		pageUrl: string;
		api: string;
		version: number;
		resolvedPageUrl?: string;
	};
	humanLanguage: string;
	type: ScraperTypes;
	title: string;
}

export type ScraperTypes =
	| "article"
	| "discussion"
	| "event"
	| "job"
	| "list"
	| "organization"
	| "video";

// Article specific interfaces
export interface DiffbotArticleObject {
	date: string;
	sentiment?: number;
	images: DiffbotImage[];
	author?: string;
	estimatedDate: string;
	publisherRegion?: string;
	icon?: string;
	diffbotUri: string;
	siteName?: string;
	type: "article";
	title: string;
	publisherCountry?: string;
	humanLanguage: string;
	authorUrl?: string;
	pageUrl: string;
	html: string;
	text: string;
	authors?: { name: string; link: string }[];
	categories?: DiffbotCategory[];
	tags?: DiffbotTag[];
}

// Discussion specific interfaces
export interface DiffbotDiscussionObject {
	date: string;
	sentiment: number;
	images: DiffbotImage[];
	estimatedDate: string;
	icon: string;
	diffbotUri: string;
	siteName: string;
	type: "article";
	title: string;
	humanLanguage: string;
	pageUrl: string;
	html: string;
	text: string;
	tags?: DiffbotTag[];
}

// Event specific interfaces
export interface DiffbotEventObject {
	images: DiffbotImage[];
	humanLanguage: string;
	diffbotUri: string;
	pageUrl: string;
	categories: DiffbotCategory[];
	type: "event";
	title: string;
	tags?: DiffbotTag[];
}

// Job specific interfaces
export interface DiffbotJobObject {
	skills: {
		salience: number;
		skill: string;
		confidence: number;
		diffbotUri: string;
	}[];
	humanLanguage: string;
	diffbotUri: string;
	employer: {
		name: string;
		diffbotUri: string;
	};
	pageUrl: string;
	locations: {
		venue?: string;
		country?: {
			name: string;
			diffbotUri: string;
			targetDiffbotId: string;
		};
		address?: string;
		city?: {
			name: string;
			diffbotUri: string;
			targetDiffbotId: string;
		};
		latitude?: number;
		longitude?: number;
		precision?: number;
		region?: {
			name: string;
			diffbotUri: string;
			targetDiffbotId: string;
		};
	}[];
	text: string;
	type: "job";
	title: string;
	remote?: "HYBRID" | "REMOTE" | "ONSITE";
	tasks: string[];
}

// List specific interfaces
export interface DiffbotListItem {
	date?: string;
	summary?: string;
	link?: string;
	title: string;
	image?: string;
	text?: string;
	"rounded-full"?: string;
	"text-primary"?: string;
	"font-medium"?: string;
}

export interface DiffbotListObject {
	diffbotUri: string;
	icon?: string;
	pageUrl: string;
	type: "list";
	title: string;
	items: DiffbotListItem[];
}

// Organization specific interfaces
export interface DiffbotOrganizationObject {
	image?: string;
	types: string[];
	images: DiffbotImage[];
	twitterUri?: string;
	nbActiveEmployeeEdges: number;
	importance: number;
	origin: string;
	diffbotUri: string;
	nbIncomingEdges: number;
	allUris: string[];
	type: "organization";
	emailAddresses?: {
		contactString: string;
		type: string;
	}[];
	name: string;
	origins: string[];
	pageUrl: string;
	id: string;
	allOriginHashes: string[];
	crawlTimestamp: number;
	nbOrigins: number;
	resolvedPageUrl: string;
}

// Product specific interfaces
export interface DiffbotProductObject {
	images: DiffbotImage[];
	offerPrice: string;
	productId?: string;
	diffbotUri: string;
	upc?: string;
	productOrigin?: string;
	mpn?: string;
	prefixCode?: string;
	multipleProducts?: boolean;
	availability: boolean;
	type: "product";
	title: string;
	offerPriceDetails: {
		symbol: string;
		amount: number;
		text: string;
	};
	specs?: Record<string, string>;
	normalizedSpecs?: Record<string, { cleanLiteral: string }[]>;
	humanLanguage: string;
	pageUrl: string;
	text?: string;
	category?: string;
	sku?: string;
	brand?: string;
}

// Video specific interfaces
export interface DiffbotVideoObject {
	duration: string;
	author?: string;
	humanLanguage: string;
	mime: string;
	diffbotUri: string;
	html: string;
	pageUrl: string;
	text: string;
	type: "video";
	title: string;
}

// Common interfaces used across multiple types
export interface DiffbotImage {
	naturalHeight?: number;
	naturalWidth?: number;
	width?: number;
	height?: number;
	diffbotUri?: string;
	url: string;
	title?: string;
	primary?: boolean;
	xpath?: string;
}

interface DiffbotTag {
	score: number;
	sentiment: number;
	count: number;
	label: string;
	uri: string;
	rdfTypes: string[];
}

interface DiffbotCategory {
	score: number;
	name: string;
	id: string;
}
