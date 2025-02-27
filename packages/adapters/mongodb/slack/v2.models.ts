export type EventLogItem = {
	target?: string;
	status?: string;
	metadata: EventMetadata;
	requests: Array<EventLogRequest>;
	duration?: number;
	elapsed?: number;
	initialLatency?: number;
};

export type EventLogRequest = {
	createdAt?: Date;
	type: string;
	input: {
		payload: unknown;
	};
	duration?: number;
	error?: string;
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

export type EventMetadata = {
	appId: string;
	teamId: string;
	context?: EventContext;
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
