import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import dayjs, { ManipulateType } from "dayjs";
import { SlackActivity } from "@proemial/adapters/mongodb/slack/activity-log.models";

export const revalidate = 0;

const NUDGE_THRESHOLD: [number, ManipulateType] = [1, "day"];

export async function GET(request: Request) {
	// await SlackDb.activityLog.upsert({
	// 	appId: "A08AD1FSPHV",
	// 	teamId: "T05A541540J",
	// 	channelId: "C08AZRGAARZ",
	// 	callback: "welcome",
	// 	user: "unknown",
	// 	isAssistant: false,
	// 	target: "welcome",
	// });
	// await SlackDb.activityLog.upsert({
	// 	appId: "A08D3TW8PT3",
	// 	teamId: "T05A541540J",
	// 	channelId: "C08DEGLKNBS",
	// 	callback: "welcome",
	// 	user: "unknown",
	// 	isAssistant: false,
	// 	target: "welcome",
	// });
	// await SlackDb.activityLog.upsert({
	// 	appId: "A08AD1FSPHV",
	// 	teamId: "T05NQ1VKK53",
	// 	channelId: "C08C24S9Q7K",
	// 	callback: "welcome",
	// 	user: "unknown",
	// 	isAssistant: false,
	// 	target: "welcome",
	// });
	// await SlackDb.activityLog.upsert({
	// 	appId: "A08BFJ29A5Q",
	// 	teamId: "T05A541540J",
	// 	channelId: "D08BCPQ2YJH",
	// 	callback: "welcome",
	// 	user: "unknown",
	// 	isAssistant: false,
	// 	target: "welcome",
	// });

	const botInvites = await SlackDb.activityLog.byTarget("welcome");

	const threshold = dayjs()
		.subtract(...NUDGE_THRESHOLD)
		.toDate();

	const activeTargets = await SlackDb.activityLog.updatedSince(threshold);
	const staleTargets = botInvites.filter(
		(target) =>
			!activeTargets.filter(
				(t) =>
					t.appId === target.appId &&
					t.teamId === target.teamId &&
					t.channelId === target.channelId,
			).length,
	);

	const extract = (target: {
		appId: string;
		teamId: string;
		channelId: string;
	}) => {
		return {
			appId: target.appId,
			teamId: target.teamId,
			channelId: target.channelId,
		};
	};

	return NextResponse.json({
		counts: {
			botInvites: botInvites.length,
			activeTargets: activeTargets.length,
			staleTargets: staleTargets.length,
		},
		botInvites: botInvites.map(extract),
		activeTargets: activeTargets.map(extract),
		staleTargets: staleTargets.map(extract),
	});
}
