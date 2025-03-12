import { GenericMessageEvent, KnownBlock } from "@slack/types";

export type HackyMessageEvent = Omit<GenericMessageEvent, "type"> & {
	// or @slack/types/MessageEvent
	type:
		| "message"
		| "app_mention"
		| "assistant_thread_started"
		| "assistant_thread_context_changed"
		| "block_actions";
	bot_profile: unknown;
	assistant_thread?: SlackAssistantThread & {
		user_id: string;
		context: {
			channel_id: string;
			team_id: string;
			enterprise_id: string;
		};
	};
	message?: {
		ts: string;
		thread_ts: string;
		channel: string;
		user: string;
		text: string;
		assistant_app_thread?: unknown;
	};
	ts: string;
};

export type SlackAssistantThread = {
	channel_id: string;
	thread_ts: string;
};

export type EventCallbackPayload = {
	api_app_id: string;
	event_id: string;
	type: string;
	challenge?: string;
	team_id: string;
	event?: HackyMessageEvent; // or @slack/types/MessageEvent
	user?: { id: string };
	actions: {
		action_id: string;
		block_id: string;
		action_ts: string;
		user_id: string;
		url: string;
	}[];
	response_url: string;
	container?: {
		message_ts: string;
	};
	message?: {
		user: string;
		bot_id: string;
	};
};

export type SlackThread = {
	messages: GenericMessageEvent[];
};

export type SlackResponse = {
	ok: boolean;
	error?: string;
	status?: string;
};
