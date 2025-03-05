import { EventCallbackPayload } from "@proemial/adapters/slack/models/event-models";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { eventName as scrapeEventName } from "@/inngest/workers/annotate/1-scrape.task";
import { eventName as askEventName } from "@/inngest/workers/ask/1-summarize.task";
import { inngest } from "@/inngest/client";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { extractLinks } from "@proemial/adapters/slack/helpers/links";
import { EphemeralMessage } from "@proemial/adapters/slack/ui-updates/ephemeral-message";
import { getThreeRandomStarters } from "../../../../../prompts/ask/suggestions";
import { isSlackFileUrl } from "@proemial/adapters/slack/files/file-scraper";
import { isTwitterUrl } from "@proemial/adapters/twitter";
import { SlackMessenger } from "@proemial/adapters/slack/slack-messenger";
import { ScrapflyWebProxy } from "@proemial/adapters/scrapfly/webproxy";

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
			return `dispatch[${scrapeEventName}]: no url found`;
		}

		// Check that the URL is accessible, unless we're already using the
		// Scrapfly scraper, or the URL is a Slack file URL
		if (!isSlackFileUrl(url) && !isTwitterUrl(url)) {
			const proxy = new ScrapflyWebProxy(process.env.SCRAPFLY_API_KEY);
			try {
				await proxy.fetch(url);
			} catch (error) {
				return `dispatch[${scrapeEventName}]: url ${url} is inaccessible`;
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

		return `dispatch[${scrapeEventName}]: ${result}`;
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

		return `dispatch[${askEventName}]: ${result}`;
	}

	if (metadata.target === "dismiss") {
		const team = await SlackDb.installs.get(metadata.teamId, metadata.appId);
		await EphemeralMessage.removeOriginal(
			payload.response_url,
			team?.metadata?.accessToken as string,
		);
		return "dismissed";
	}

	if (metadata.target === "suggestions") {
		await SlackMessenger.showSuggestions(
			metadata,
			getThreeRandomStarters(),
			"Trustworthy answers to any question, such as:",
		);
	}

	if (metadata.target === "nudge") {
		await SlackMessenger.nudgeUser(metadata);
		return "nudged";
	}

	return undefined;
}
