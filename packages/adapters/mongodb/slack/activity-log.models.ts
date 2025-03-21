export type SlackActivity = {
	appId: string;
	teamId: string;
	channelId: string;
	userId: string;
	target: string;
	createdAt: Date;
	updatedAt: Date;
	latestAt: {
		ts: string;
		threadTs?: string;
	};
};
