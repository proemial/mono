import { NextResponse } from "next/server";

// Requirement: https://slack.com/oauth/v2/authorize?user_scope=chat:write&client_id=5345137174018.8389614316194&redirect_uri=https://assistant.proem.ai/api/events/oauth/A08BFJ29A5Q
export async function GET() {
	const result = await fetch("https://slack.com/api/chat.update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization:
				"Bearer xoxp-5345137174018-5368833567504-8472299068148-dac7d9ffe677da1b52a19ca80cc8f87e",
		},
		body: JSON.stringify({
			channel: "C08B4RXM2AE",
			ts: "1739882918.852029",
			text: "<https://www.bbc.com/future/article/20250213-youtube-at-20-a-computer-that-drunk-dials-online-videos-reveals-statistics-that-google-doesnt-want-you-to-know|https://www.bbc.com/future/article/20250213-youtube-at-20-a-computer-that-drunk-di[…]e-videos-reveals-statistics-that-google-doesnt-want-you-to-know>",
			blocks: [
				{
					type: "rich_text",
					block_id: "gFNlC",
					elements: [
						{
							type: "rich_text_section",
							elements: [
								{
									type: "link",
									url: "https://www.bbc.com/future/article/20250213-youtube-at-20-a-computer-that-drunk-dials-online-videos-reveals-statistics-that-google-doesnt-want-you-to-know",
									text: "https://www.bbc.com/future/article/20250213-youtube-at-20-a-computer-that-drunk-di[…]e-videos-reveals-statistics-that-google-doesnt-want-you-to-know",
								},
							],
						},
					],
				},
			],
			attachments: [
				{
					image_url:
						"https://techcrunch.com/wp-content/uploads/2025/02/perplexity-deep-research.jpeg?resize=1200,675",
					image_width: 1200,
					image_height: 675,
					image_bytes: 102272,
					from_url:
						"https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/",
					service_icon:
						"https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png?w=180",
					ts: 1739644754,
					id: 1,
					original_url:
						"https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/",
					fallback:
						"TechCrunch: Perplexity launches its own freemium ‘deep research’ product | TechCrunch",
					text: "Perplexity has become the latest AI company to release an in-depth research tool, with a new feature announced Friday. Google unveiled a similar feature",
					title:
						"Perplexity launches its own freemium ‘deep research’ product | TechCrunch",
					title_link:
						"https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/",
					service_name: "TechCrunch",
					fields: [
						{ value: "Anthony Ha", title: "Written by", short: true },
						{
							value: "3 minutes",
							title: "Est. reading time",
							short: true,
						},
						{ value: "Thinking...", title: "Status", short: true },
					],
				},
			],
		}),
	});
	const json = await result.json();
	console.log("JSON", json);

	return NextResponse.json({ messages: json });
}
