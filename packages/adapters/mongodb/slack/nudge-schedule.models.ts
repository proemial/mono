export type ScheduledNudge = {
	appId: string;
	teamId: string;
	channelId: string;
	userId?: string;
	target: string;
	scheduledAt: Date; // Use Date.max() for disabling nudges
};

export type ScheduledNudgeDB = ScheduledNudge & {
	createdAt: Date;
	updatedAt: Date;
};
