export type Event = {
	createdAt: Date;
	metadata: EventMetadata;
	source: "slack" | "n8n";
	type: "SlackOauthEvent" | "SlackEventCallback" | "N8nEvent";
	payload: SlackOauthEvent | SlackEventCallback | N8nEvent;
};

export type EventMetadata = {
	appId: string; // app_id || api_app_id
	eventId: string; // generated
	teamId: string; // team_id
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type N8nEvent = {};

export type SlackEventCallback = {
	api_app_id: string;
	authorizations: [
		{
			enterprise_id: null;
			is_bot: true;
			is_enterprise_install: false;
			team_id: string;
			user_id: string;
		},
	];
	event: unknown;
	event_context: string;
	event_id: string;
	event_time: number;
	is_ext_shared_channel: boolean;
	team_id: string;
	token: string;
	type: "event_callback";
};

export type SlackOauthEvent = {
	access_token: string;
	app_id: string;
	authed_user: { id: string };
	bot_user_id: string;
	// enterprise: null;
	incoming_webhook: {
		channel: string;
		channel_id: string;
		configuration_url: string;
		url: string;
	};
	is_enterprise_install: false;
	ok: true;
	scope: string;
	team: {
		id: string;
		name: string;
	};
	token_type: string;
};
