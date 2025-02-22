import { link } from "@proemial/adapters/slack/block-kit/link-blocks";
import { nudge } from "@proemial/adapters/slack/block-kit/nudge-blocks";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
	const linkBlocks = link(
		"OpenAI is in the final stages of developing its own AI processor to reduce reliance on Nvidia hardware, as reported by Reuters. The company plans to send its chip designs to TSMC for fabrication soon, although details about the chip's capabilities and timeline remain undisclosed. This move mirrors efforts by other tech giants like Microsoft and Google, who have developed custom AI chips to cut costs and address Nvidia's dominance in the GPU market. OpenAI's initiative aims to provide leverage in supplier negotiations and potentially achieve independence with a proprietary chip design.",
		"https://arstechnica.com/ai/2025/02/openais-secret-weapon-against-nvidia-dependence-takes-shape/",
		"OpenAI’s secret weapon against Nvidia dependence takes shape - Ars Technica",
	);
	const blocks = nudge("5345137174018.8389614316194", "T05A541540J");

	// const result1 = await fetch("https://slack.com/api/chat.postEphemeral", {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json; charset=utf-8",
	// 		Authorization:
	// 			"Bearer xoxb-5345137174018-8375104708407-ofxehbZdLYYiMLadWas3LtFx",
	// 	},
	// 	body: JSON.stringify({
	// 		channel: "C08B4RXM2AE",
	// 		user: "U05AUQHGPEU",
	// 		// threadTs is the timestamp of the message in the thread. Exclude if the message is not in a thread.
	// 		// ...(metadata.threadTs && { thread_ts: metadata.threadTs }),
	// 		attachments: {
	// 			...linkBlocks.attachments,
	// 		},
	// 	}),
	// });
	const result2 = await fetch("https://slack.com/api/chat.postEphemeral", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization:
				"Bearer xoxb-5345137174018-8375104708407-ofxehbZdLYYiMLadWas3LtFx",
		},
		body: JSON.stringify({
			channel: "C08B4RXM2AE",
			user: "U05AUQHGPEU",
			// threadTs is the timestamp of the message in the thread. Exclude if the message is not in a thread.
			// ...(metadata.threadTs && { thread_ts: metadata.threadTs }),
			blocks: blocks.blocks,
		}),
	});

	// const json1 = await result1.json();
	const json2 = await result2.json();
	return NextResponse.json({ json2 });
}
