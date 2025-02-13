import { GenericMessageEvent, KnownBlock } from "@slack/types";

export type HackyMessageEvent = Omit<GenericMessageEvent, "type"> & {
	// or @slack/types/MessageEvent
	type:
		| "message"
		| "app_mention"
		| "assistant_thread_started"
		| "assistant_thread_context_changed";
	bot_profile: unknown;
	assistant_thread?: {
		user_id: string;
		context: {
			channel_id: string;
			team_id: string;
			enterprise_id: string;
		};
		channel_id: string;
		thread_ts: string;
	};
};

export type EventCallbackPayload = {
	api_app_id: string;
	event_id: string;
	type: string;
	challenge?: string;
	team_id?: string;
	event: HackyMessageEvent; // or @slack/types/MessageEvent
};

export type SlackThread = {
	messages: GenericMessageEvent[];
};
