import { showSuggestions, setStatus } from "@proemial/adapters/slack/assistant";
import { getThreadMessages } from "@proemial/adapters/slack/channel";
import { NextResponse } from "next/server";

export async function GET() {
	const result = await suggestions();
	// const result = await getThreadMessages(
	// 	thread.channel_id,
	// 	thread.thread_ts,
	// 	metadata.team.id,
	// 	metadata.appId,
	// );

	return NextResponse.json(result);
}

async function status() {
	return await setStatus(metadata, "Fetching thread history...");
}

async function suggestions() {
	return await showSuggestions(
		metadata,
		[
			"xxWhat are stem cells?",
			"xxDo solar subsidies increase adoption?",
			"xxDoes strict food safety increase food waste?",
		],
		"Trustworthy answers to any question, such as:",
	);
}

const metadata = {
	callback: "https://3565-87-116-0-126.ngrok-free.app/api/events/outbound",
	appId: "A08BFJ29A5Q",
	eventId: "Ev08DJCZUG9F",
	teamId: "T05A541540J",
	channel: {
		id: "C059YDVTXSA",
		name: undefined,
		description: undefined,
		topic: undefined,
	},
	team: {
		id: "T05A541540J",
		name: "proemial",
		description: "insert from input field",
	},
	assistantThread: {
		channel_id: "D08BCPQ2YJH",
		thread_ts: "1739455963.288489",
	},
};
