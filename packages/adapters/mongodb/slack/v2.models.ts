export type SlackV2Event = {
	eventId: string;
	type: string;
	payload?: unknown;
	error?: string;
};
export type SlackV2EventFromDb = SlackV2Event & SlackV2DbEvent;

export type SlackV2DbEvent = {
	createdAt?: Date;
};

export type SlackV2MessageTarget = {
	channelId: string;
	ts: string;
	threadTs?: string;
	accessToken: string;
	userId?: string;
};
