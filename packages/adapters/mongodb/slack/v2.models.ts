// export type Event = {
// 	createdAt: Date;
// 	updatedAt: Date;
// 	metadata: {
// 		appId: string;
// 		teamId: string;
// 		context: {
// 			channelId: string;
// 			userId: string;
// 			ts?: string;
// 			threadTs?: string;
// 		};
// 	};
// 	requests: Array<{
// 		type: string;
// 		createdAt: Date;
// 		updatedAt: Date;
// 		input: {
// 			type: string;
// 			payload: unknown;
// 		};
// 		output: {
// 			type: string;
// 			responseCode: number;
// 			payload: unknown;
// 		};
// 	}>;
// };

// const examples = [
// 	{
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		source: "slack/inbound",
// 		metadata: {
// 			appId: "A08BFJ29A5Q",
// 			teamId: "T05A541540J",
// 			context: {
// 				channelId: "C08B4RXM2AE",
// 				userId: "userId",
// 				ts: "1740555207.845049",
// 			},
// 		},
// 	},
// ];

export type EventMetric = {
	ts: Date;
	metadata: {
		appId: string;
		operation: string;
		step: string;
		teamId: string;
	};
	metrics: {
		duration: number;
		error?: string;
	};
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
