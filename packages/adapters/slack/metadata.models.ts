export type SlackEventMetadata = {
	callback: string;
	appId: string;
	eventId: string;
	teamId: string;
	channel: SlackChannel;
	team: SlackTeam;
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
