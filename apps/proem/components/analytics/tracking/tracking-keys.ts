import { ObjectValues } from "@/utils/object-values";
import { Tracker } from "./tracker";

export function trackHandler(
	key: TrackingKey,
	properties?: Record<string, string>,
) {
	return () => {
		console.log("Tracking", key, properties);

		Tracker.track(key, properties);
	};
}

export const COLLECTION_FROM_OPTIONS = {
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
				close: "menu:close:click",
				theme: "menu:theme:click",
				feedback: "menu:feedback:click",
				version: "menu:version:click",
				terms: "menu:terms:click",
				privacy: "menu:privacy:click",
				signin: "menu:signin:click",
				signout: "menu:signout:click",
				org: "menu:org:click",

				// TODO: cleanup
				ask: "menu:ask:click",
				feed: "menu:feed:click",
				read: "menu:read:click",
				you: "menu:profile:click",

				collapse: {
					profile: "menu:profile:collapse:click",
					organizations: "menu:organizations:collapse:click",
					collections: "menu:collections:collapse:click",
				},
			},
		},
		header: {
			click: {
				// TODO: cleanup
				logo: "header:logo:click",
				discover: "header:discover:click",
				ask: "header:ask:click",
				close: "header:close:click",
				search: "header:search:click",
				simple: "header:simple:click",
				changeSpace: "header:change-space:click",
				back: "header:back:click",
			},
		},
	},
	chat: {
		click: {
			stop: "chat:stop:click",
			clear: "chat:clear:click",
			share: "chat:share:click",
			input: "chat:input:click",
			submit: "chat:submit:click",
			starter: "chat:starter:click",
			followup: "chat:followup:click",
			suggestion: "chat:suggestion:click",
			suggestionsCategory: "chat:suggestions:category:click",
		},
		submit: {
			input: "input:submit",
		},
	},
	ask: {
		click: {
			collapse: "ask:papers:collapse:click",
			paper: "ask:paper:click",
			avatar: "ask:avatar:click",
			model: "ask:model:click",
			modelEmailInputField: "ask:model:email_input_field:click",

			// TODO: cleanup
			answerCard: "ask:answer-card:click",
			answerLink: "ask:answer-link:click",
		},
		submit: {
			modelEmail: "ask:model:email:submit",
		},
	},
	feed: {
		// TODO: cleanup
		click: {
			card: "feed:card:click",
			tag: "feed:tag:click",
		},
		scroll: {
			fetch: "feed:scroll:fetch",
		},
	},
	read: {
		click: {
			collapse: "read:metadata:collapse:click",
			fullPaper: "read:full-paper:click",
			model: "read:model:click",
			modelEmailInputField: "read:model:email_input_field:click",
			explainer: "read:chat:explainer:click",

			// TODO: cleanup
			feed: "read:feed:click",
			random: "read:random:click",
			askStarter: "read:ask_starter:click",
			share: "read:share:click",
			starter: "read:starter:click",
			answers: "read:tab-answers:click",
			metadata: "read:tab-metadata:click",
		},
		submit: {
			// TODO: cleanup
			ask: "read:ask_input:submit",
			question: "read:input:submit",
			modelEmail: "read:model:email:submit",
		},
	},
	collection: {
		addPaper: addCollectionFrom("collection:add_paper"),
		removePaper: addCollectionFrom("collection:remove_paper"),
		openCollectionSelector: addCollectionFrom(
			"collection:open_collection_selector",
		),
		openFromMenu: "collection:open_from_menu",
		openEditFormFromMenu: "collection:open_edit_form_from_menu",
		openDeleteFormFromMenu: "collection:open_delete_form_from_menu",
		deleteFromMenuConfirmation: "collection:delete_from_menu_confirmation",
		deleteFromMenuCancelation: "collection:delete_from_menu_cancelation",
		createFormSubmit: "collection:create_form_submit",
		editFormSubmit: "collection:edit_form_submit",
	},
	profile: {
		// TODO: cleanup
		click: {
			feedback: "profile:feedback:click",
			privacy: "profile:privacy:click",
			logout: "profile:logout:click",
		},
	},
	assistant: {
		open: "assistant:open",
		close: "assistant:close",
		reactivate: "assistant:reactivate",
		ask: {
			userQuestion: "assistant:ask:user_question",
			suggestion: {
				starter: "assistant:ask:suggestion:starter",
				generated: "assistant:ask:suggestion:generated",
				followUp: "assistant:ask:suggestion:follow_up",
			},
		},
		regenSuggestions: "assistant:regen_suggestions",
	},
	search: {
		click: {
			submit: "search:submit:click",
		},
		submit: {
			query: "search:query:submit",
		},
	},
	viewName: (path: string) => {
		return `${getViewName(path)}:view`;
	},
	institutions: {
		follow: {
			click: "institutions:follow:click",
		},
	},
} as const;

function getViewName(path: string) {
	if (path === "/") return "ask";
	if (path.startsWith("/oa")) return "read";
	if (path === "/profile") return "you";
	if (path.includes("andrej-karpathy-llm-reading-list")) return "karpathy";
	if (path.startsWith("/discover")) return "institutions"; // will also match `fingerprints` and `hugs`
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
export type AddPaperToCollectionTrackingKey = ObjectValues<
	typeof analyticsKeys.collection.addPaper
>;
export type RemovePaperToCollectionTrackingKey = ObjectValues<
	typeof analyticsKeys.collection.removePaper
>;
