export type EventLogItem = {
	createdAt: Date;
	updatedAt: Date;
	source: string;
	metadata: {
		appId: string;
		teamId: string;
		context?: EventContext;
	};
	requests: Array<{
		type: string;
		createdAt: Date;
		input: {
			type: string;
			payload: unknown;
		};
		output: {
			responseCode: number;
			payload: unknown;
		};
	}>;
};

export type EventMetric = {
	ts: Date;
	metadata: {
		operation: string;
		step: string;
		appId: string;
		teamId: string;
		context?: EventContext;
	};
	metrics: {
		duration: number;
		error?: string;
	};
};

export type EventContext = {
	channelId: string;
	userId: string;
	ts?: string;
	threadTs?: string;
};

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
	accessTokens: {
		userToken: string;
		teamToken: string;
	};
	userId?: string;
};
