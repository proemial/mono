export type SlackEventMetadata = {
	callback: string;
	appId: string;
	teamId: string;
	channelId: string;
	user: string;
	ts?: string;
	threadTs?: string;
	replyTs?: string;
	isAssistant: boolean;
	target: string;
};

export type SlackAssistantThread = {
	channel_id: string;
	thread_ts: string;
};

export type SlackChannel = {
	id: string;
	name?: string;
	description?: string;
	topic?: string;
};

export type SlackTeam = {
	id: string;
	name?: string;
	description?: string;
};
