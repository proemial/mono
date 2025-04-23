import { ObjectValues } from "@/utils/object-values";
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
	// ui: {
	// 	menu: {
	// 		click: {
	// 			open: "menu:open:click",
	// 			close: "menu:close:click",
	// 			theme: "menu:theme:click",
	// 			feedback: "menu:feedback:click",
	// 			version: "menu:version:click",
	// 			terms: "menu:terms:click",
	// 			privacy: "menu:privacy:click",
	// 			signin: "menu:signin:click",
	// 			signout: "menu:signout:click",
	// 			org: "menu:org:click",

	// 			// TODO: cleanup
	// 			ask: "menu:ask:click",
	// 			feed: "menu:feed:click",
	// 			read: "menu:read:click",
	// 			you: "menu:profile:click",

	// 			collapse: {
	// 				profile: "menu:profile:collapse:click",
	// 				organizations: "menu:organizations:collapse:click",
	// 				collections: "menu:collections:collapse:click",
	// 			},

	// 			createSpace: "menu:create_space:click",
	// 		},
	// 	},
	// 	header: {
	// 		click: {
	// 			// TODO: cleanup
	// 			logo: "header:logo:click",
	// 			discover: "header:discover:click",
	// 			ask: "header:ask:click",
	// 			close: "header:close:click",
	// 			search: "header:search:click",
	// 			simple: "header:simple:click",
	// 			changeSpace: "header:change-space:click",
	// 			back: "header:back:click",
	// 			viewAllSpaces: "header:view-all-spaces:click",
	// 			createSpace: "header:create-space:click",
	// 		},
	// 	},
	// },
	// read: {
	// 	click: {
	// 		collapse: "read:metadata:collapse:click",
	// 		fullPaper: "read:full-paper:click",
	// 		model: "read:model:click",
	// 		modelEmailInputField: "read:model:email_input_field:click",
	// 		explainer: "read:chat:explainer:click",

	// 		// TODO: cleanup
	// 		feed: "read:feed:click",
	// 		random: "read:random:click",
	// 		askStarter: "read:ask_starter:click",
	// 		share: "read:share:click",
	// 		starter: "read:starter:click",
	// 		answers: "read:tab-answers:click",
	// 		metadata: "read:tab-metadata:click",

	// 		relatedCard: "read:related:card:click",
	// 		spaceCard: "read:space:card:click",
	// 		spaceGoto: "read:space:goto:click",
	// 	},
	// 	submit: {
	// 		// TODO: cleanup
	// 		ask: "read:ask_input:submit",
	// 		question: "read:input:submit",
	// 		modelEmail: "read:model:email:submit",
	// 	},
	// },
	viewName: (path: string) => {
		return `${getViewName(path)}:view`;
	},
	experiments: {
		news: {
			header: {
				clickLogo: "experiments:news:header:click_logo",
				clickAdd: "experiments:news:header:click_add",
				clickBack: "experiments:news:header:click_back",
			},
			feed: {
				clickCard: "experiments:news:feed:click_card",
			},
			item: {
				clickSource: "experiments:news:item:click_source",
				clickViewCounter: "experiments:news:item:click_view_counter",
				clickAskScience: "experiments:news:item:click_ask_science",
				clickShare: "experiments:news:item:click_share",
				clickViewAllSourcesFactualBackground:
					"experiments:news:item:click_view_all_sources_factual_background",
				qa: {
					clickAskInputField: "experiments:news:item:qa:click_ask_input_field",
					clickShowMore: "experiments:news:item:qa:click_show_more_button",
					submitAskInput: "experiments:news:item:qa:submit_ask_input",
					clickSuggestedQuestion:
						"experiments:news:item:qa:click_suggested_question",
					clickViewAllSources:
						"experiments:news:item:qa:click_view_all_sources",
				},
				sources: {
					clickPaperSource: "experiments:news:item:sources:click_paper_source",
				},
				clickScienceBotBadge: "experiments:news:item:click_science_bot_badge",
				clickInlineReference: "experiments:news:item:click_inline_reference",
				clickAnswerLike: "experiments:news:item:click_answer_like",
				clickAnswerShare: "experiments:news:item:click_answer_share",
			},
			clickGenerate: "experiments:news:click_generate",
			clickSubscribe: "experiments:news:click_subscribe",
		},
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

export const vercelRegions: Record<string, string> = {
	arn1: "eu-north-1", // Stockholm, Sweden
	bom1: "ap-south-1", // Mumbai, India
	cdg1: "eu-west-3", // Paris, France
	cle1: "us-east-2", // Cleveland, USA
	cpt1: "af-south-1", // Cape Town, South Africa
	dub1: "eu-west-1", // Dublin, Ireland
	fra1: "eu-central-1", // Frankfurt, Germany
	gru1: "sa-east-1", // São Paulo, Brazil
	hkg1: "ap-east-1", // Hong Kong
	hnd1: "ap-northeast-1", // Tokyo, Japan
	iad1: "us-east-1", // Washington, D.C., USA
	icn1: "ap-northeast-2", // Seoul, South Korea
	kix1: "ap-northeast-3", // Osaka, Japan
	lhr1: "eu-west-2", // London, United Kingdom
	pdx1: "us-west-2", // Portland, USA
	sfo1: "us-west-1", // San Francisco, USA
	sin1: "ap-southeast-1", // Singapore
	syd1: "ap-southeast-2", // Sydney, Australia
};

export type TrackingKey = ObjectValues<typeof analyticsKeys> | string;
