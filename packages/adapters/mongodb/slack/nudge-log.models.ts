export type LoggedNudge = {
	appId: string;
	teamId: string;
	channelId: string;
	userId?: string;
	target: string;
	content: any;
};

export type LoggedNudgeDB = LoggedNudge & {
	createdAt: Date;
};
