import { NextResponse } from "next/server";

// Requirement: https://slack.com/oauth/v2/authorize?user_scope=chat:write&client_id=5345137174018.8389614316194
// 				https://slack.com/oauth/v2/authorize?user_scope=chat:write&client_id=5345137174018.8389614316194&team=T089HNAFG5D
// 				https://slack.com/oauth/v2/authorize&user_scope=chat:write&client_id=5345137174018.8389614316194&team=T089HNAFG5D

// 	assistant:dev: TARGET {
// 	assistant:dev:   channelId: 'C08B4RXM2AE',
// 	assistant:dev:   ts: '1739979763.485219',
// 	assistant:dev:   threadTs: '1739979126.307719',
// 	assistant:dev:   accessToken: 'xoxp-5345137174018-5368833567504-8490114071681-3ece82a9cb11cc930f3b5a46cc33ae74'

export async function GET() {
	const result = await fetch("https://slack.com/api/chat.update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization:
				"Bearer xoxp-5345137174018-5368833567504-8490114071681-3ece82a9cb11cc930f3b5a46cc33ae74",
		},
		body: JSON.stringify({
			channel: "C08B4RXM2AE",
			ts: "1739994734.459249",
			text: "<@U08B132LUBZ> does hedgehogs dream",
			attachments: [
				{
					id: 1,
					pretext: "summary",
					color: "#7DFA85",
					fallback:
						"No specific research was found on whether hedgehogs dream. However, like many mammals, hedgehogs likely experience REM sleep, a phase associated with dreaming in humans. This suggests they might have dream-like experiences, but more research is needed to confirm this.",
					text: "No specific research was found on whether hedgehogs dream. However, like many mammals, hedgehogs likely experience REM sleep, a phase associated with dreaming in humans. This suggests they might have dream-like experiences, but more research is needed to confirm this.",
				},
			],
			blocks: [
				{
					type: "rich_text",
					block_id: "g=434",
					elements: [
						{
							type: "rich_text_section",
							elements: [
								{ type: "user", user_id: "U08B132LUBZ" },
								{ type: "text", text: " does hedgehogs dream" },
							],
						},
					],
				},
			],
		}),
	});
	const json = await result.json();
	console.log("JSON", json);

	return NextResponse.json({ messages: json });
}
