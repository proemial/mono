import { getThreadMessagesForAi } from "@proemial/adapters/slack/helpers/thread";
import CollapsibleForm from "./collapsible-form";
import { answerParams } from "@/prompts/ask/summarize-prompt";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";

export const dynamic = "force-dynamic";

export default async function SlackDebugPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const metadata = JSON.parse(searchParams.metadata as string);

	const messages = await getThreadMessagesForAi(metadata as SlackEventMetadata);

	return (
		<CollapsibleForm
			tools={JSON.stringify(answerParams.tools, null, 2)}
			messages={JSON.stringify(messages, null, 2)}
			prompt={answerParams.prompt}
			metadata={metadata}
		/>
	);
}
