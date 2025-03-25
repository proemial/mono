import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { eventName as scrapeEventName } from "@/inngest/workers/annotate/1-scrape.task";
import { eventName as askEventName } from "@/inngest/workers/ask/1-summarize.task";
import { inngest } from "@/inngest/client";
import { extractLinks } from "@proemial/adapters/slack/helpers/links";
import { isSlackFileUrl } from "@proemial/adapters/slack/files/file-scraper";
import { isTwitterUrl } from "@proemial/adapters/twitter";
import { ScrapflyWebProxy } from "@proemial/adapters/scrapfly/webproxy";
import { Slack } from "@/inngest/workers/helpers/slack";
import {
	getButtonValue,
	getFollowupQuestion,
} from "@proemial/adapters/slack/helpers/payload";
import { Qdrant } from "@proemial/adapters/qdrant/qdrant";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { asMrkdwn } from "@proemial/adapters/slack/slack-messenger";
import { fetchPapers } from "@/inngest/workers/tools/search-papers-tool";
import { toTitleCaseIfAllCaps } from "@proemial/utils/string";

export async function dispatchSlackEvent(
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) {
	if (metadata.target === "annotate") {
		const fileUrl =
			payload.event?.subtype === "file_share" && payload.event?.files?.[0]
				? payload.event.files[0].url_private_download
				: undefined;

		// TODO: handle all links, not just the first one
		const url = fileUrl ?? extractLinks(payload.event?.text).at(0);
		if (!url) {
			return {
				status: "failed",
				event: scrapeEventName,
				error: "No url found",
			};
		}

		// Check that the URL is accessible, unless we're already using the
		// Scrapfly scraper, or the URL is a Slack file URL
		if (!isSlackFileUrl(url) && !isTwitterUrl(url)) {
			const proxy = new ScrapflyWebProxy(process.env.SCRAPFLY_API_KEY);
			try {
				await proxy.fetch(url);
			} catch (error) {
				return {
					status: "failed",
					event: scrapeEventName,
					error: "Scrape blocked",
				};
			}
		}

		const result = await inngest.send({
			name: scrapeEventName,
			data: {
				url,
				fileMimetype: fileUrl ? payload.event?.files?.[0]?.mimetype : undefined,
				metadata: { ...metadata },
			},
		});

		return {
			status: "dispatched",
			event: scrapeEventName,
		};
	}

	if (metadata.target === "answer") {
		const result = await inngest.send({
			name: askEventName,
			data: {
				thread: payload.event?.thread_ts,
				question: payload.event?.text,
				metadata: { ...metadata },
			},
		});

		return {
			status: "dispatched",
			event: askEventName,
		};
	}

	if (metadata.target === "followup") {
		const { question, botUser } = await getFollowupQuestion(metadata, payload);

		const canPostAsUser = await Slack.canPostAsUser(metadata);
		if (canPostAsUser) {
			await Slack.postQuestion(metadata, `${question} <@${botUser}>`);
			return {
				status: "dispatched",
				event: "followup",
			};
		}

		// Slack doesn't send a mention event to us, if we tag ourselves
		// in a thread. So we need to ask the question explicitly.
		await inngest.send({
			name: askEventName,
			data: {
				thread: payload.event?.thread_ts,
				question,
				metadata,
			},
		});
		return {
			status: "dispatched",
			event: askEventName,
		};
	}

	if (metadata.target === "related_content") {
		return postRelatedContent(payload, metadata);
	}

	if (metadata.target === "ask_question") {
		const { question, botUser } = await getButtonValue(metadata, payload);

		const canPostAsUser = await Slack.canPostAsUser(metadata);
		if (canPostAsUser) {
			await Slack.postQuestion(metadata, `${question} <@${botUser}>`);
			return {
				status: "dispatched",
				event: metadata.target,
			};
		}

		// Slack doesn't send a mention event to us, if we tag ourselves
		// in a thread. So we need to ask the question explicitly.
		await inngest.send({
			name: askEventName,
			data: {
				question,
				metadata,
			},
		});

		return {
			status: "dispatched",
			event: askEventName,
		};
	}

	if (metadata.target === "post_link") {
		const { question } = await getButtonValue(metadata, payload);

		const canPostAsUser = await Slack.canPostAsUser(metadata);
		if (canPostAsUser) {
			const message = await Slack.postQuestion(metadata, question as string);

			return {
				status: "dispatched",
				event: metadata.target,
			};
		}

		return {
			status: "failed",
			event: metadata.target,
			error: "Cannot post as user",
		};
	}

	if (metadata.target === "suggestions") {
		const result = await Slack.showSuggestions(
			metadata,
			"Trustworthy answers to any question, such as:",
		);

		return {
			status: "executed",
			event: "suggestions",
		};
	}

	if (metadata.target === "welcome") {
		await Slack.showWelcome(metadata, payload.event?.inviter);

		return {
			status: "executed",
			event: "welcome",
		};
	}

	return undefined;
}

const postRelatedContent = async (
	payload: EventCallbackPayload,
	metadata: SlackEventMetadata,
) => {
	const url = payload.actions.at(0)?.value;
	if (!url) {
		return {
			status: "failed",
			event: metadata.target,
			error: "No URL found",
		};
	}
	const scrapedUrl = await SlackDb.scraped.get(url);
	if (!scrapedUrl?.summaries?.summary) {
		return {
			status: "failed",
			event: metadata.target,
			error: "No summary found",
		};
	}

	const similariryScoreThreshold = 0.4;
	const maxAttachments = 4;
	const maxPapers = 4;

	// Look up relevant content from URLs and files in the channel
	const attachmentSearchResults = await Qdrant.search(
		{
			appId: metadata.appId,
			teamId: metadata.teamId,
			context: {
				channelId: metadata.channelId,
			},
		},
		scrapedUrl.summaries.summary as string,
	);
	console.log(`Attachment search results: ${attachmentSearchResults.length}`);

	// Filter attachments by score and remove duplicates
	const relatedAttachments = attachmentSearchResults.filter(
		(attachment) =>
			attachment.score >= similariryScoreThreshold &&
			// Don't include the original item
			attachment.payload.url !== url &&
			attachment.payload.content.title !== scrapedUrl.content?.title,
	);
	const relatedAttachmentsNoDuplicates = relatedAttachments.filter(
		(attachment, index) =>
			relatedAttachments.findIndex(
				(a) => a.payload.content.text === attachment.payload.content.text,
			) === index,
	);

	console.log(
		`Related attachments: ${relatedAttachmentsNoDuplicates.length} (max score: ${Math.max(...attachmentSearchResults.map((a) => a.score))}, threshold: ${similariryScoreThreshold})`,
	);

	// Fetch relevant scraped content
	const relatedScraped = await Promise.all(
		relatedAttachmentsNoDuplicates.map((r) =>
			SlackDb.scraped.get(r.payload.url),
		),
	);
	const relatedScrapedWithScores = relatedScraped.map((scraped, i) => ({
		...scraped,
		score: relatedAttachmentsNoDuplicates[i].score,
	}));

	// Format attachments
	const attachments = relatedScrapedWithScores
		.slice(0, maxAttachments)
		.map((scraped) =>
			formatItem(
				(scraped.summaries?.translatedTitle as string) ??
					scraped.content?.title ??
					"",
				scraped.url ?? "",
				scraped.score,
				(scraped.summaries?.summary as string) ?? "",
			),
		);

	// Fetch related papers
	const paperSearchResults = await fetchPapers(
		scrapedUrl.summaries.summary as string,
	);
	console.log(`Paper search results: ${paperSearchResults.length}`);

	// Filter papers by score
	const relatedPapers = paperSearchResults.filter(
		(paper) =>
			paper.score >= similariryScoreThreshold &&
			// Don't include the original item
			paper.primary_location.landing_page_url !== url &&
			paper.title !== scrapedUrl.content?.title,
	);
	console.log(
		`Related papers: ${relatedPapers.length} (max score: ${Math.max(...paperSearchResults.map((p) => p.score))}, threshold: ${similariryScoreThreshold})`,
	);

	// Format papers
	const papers = relatedPapers.slice(0, maxPapers).map((paper) => {
		return formatItem(
			toTitleCaseIfAllCaps(paper.title),
			paper.primary_location.landing_page_url,
			paper.score,
			paper.abstract,
		);
	});

	await Slack.postRelatedContent(metadata, attachments, papers);

	return {
		status: "dispatched",
		event: "related_content",
	};
};

const formatItem = (
	title: string,
	url: string,
	score: number,
	summary: string,
) => {
	const maxTitleLength = 50;
	const maxParagraphLength = 200;

	const trimmedTitle =
		title.slice(0, maxTitleLength).trimEnd() +
		(title.length > maxTitleLength ? "…" : "");
	const trimmedSummary =
		summary.slice(0, maxParagraphLength).trimEnd() +
		(summary.length > maxParagraphLength ? "…" : "");
	const scorePercentage = (score * 100).toFixed(0);
	return asMrkdwn(
		`[**${trimmedTitle}**](${url}) · ${scorePercentage}%\n${trimmedSummary}`,
	);
};
