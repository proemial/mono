import { Tracker } from "./tracker";

export function trackHandler(
	key: TrackingKey,
	properties?: Record<string, string>,
) {
	return () => {
		Tracker.track(key, properties);
	};
}

const COLLECTION_FROM_OPTIONS = {
	fromFeed: "from_feed",
	fromAsk: "from_ask",
	fromRead: "from_read",
} as const;

export type CollectionFromOptions = keyof typeof COLLECTION_FROM_OPTIONS;

function addCollectionFrom<T extends string>(prefix: T) {
	return Object.entries(COLLECTION_FROM_OPTIONS).reduce(
		(acc, [key, value]) => ({ ...acc, [key]: `${prefix}:${value}` }),
		{},
	) as {
		[K in keyof typeof COLLECTION_FROM_OPTIONS]: `${T}:${(typeof COLLECTION_FROM_OPTIONS)[K]}`;
	};
}

export const analyticsKeys = {
	ui: {
		menu: {
			click: {
				open: "menu:open:click",
			},
		},
	},
	chat: {
		click: {
			reference: "chat:reference:click",

			// clear: "chat:clear:click",
			// share: "chat:share:click",
			// input: "chat:input:click",
			// submit: "chat:submit:click",
			// starter: "chat:starter:click",
			// followup: "chat:followup:click",
			// suggestion: "chat:suggestion:click",
		},
		submit: {
			// input: "input:submit",
		},
	},
	viewName: (path: string) => {
		return `${getViewName(path)}:view`;
	},
} as const;

function getViewName(path: string) {
	if (path === "/") return "ask";
	if (path.startsWith("/oa")) return "read";
	if (path === "/profile") return "you";
	if (path.includes("andrej-karpathy-llm-reading-list")) return "karpathy/";
	if (path.startsWith("/discover")) return "institutions/"; // will also match `/discover/hugs`
	return path.slice(1);
}

type ObjectValues<T> = T extends { [key: string]: infer U }
	? U extends object
		? ObjectValues<U>
		: U
	: T;

export type TrackingKey = ObjectValues<typeof analyticsKeys> | string;
