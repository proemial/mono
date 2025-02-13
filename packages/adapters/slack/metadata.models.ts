export type SlackEventMetadata = {
	callback: string;
	appId: string;
	eventId: string;
	teamId: string;
	channel: SlackChannel;
	team: SlackTeam;
	assistantThread?: SlackAssistantThread;
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
