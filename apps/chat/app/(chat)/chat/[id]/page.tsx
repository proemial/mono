import { CoreMessage } from "ai";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { DEFAULT_MODEL_NAME, models } from "@/ai/models";
import { Chat as PreviewChat } from "@/components/custom/chat";
import { getChatById, getMessagesByChatId } from "@/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { getSessionId } from "@/app/(auth)/sessionid";

export default async function Page(props: { params: Promise<any> }) {
	const params = await props.params;
	const { id } = params;
	const chat = await getChatById({ id });

	if (!chat) {
		notFound();
	}

	const sessionId = await getSessionId();

	if (!sessionId) {
		return notFound();
	}

	if (sessionId !== chat.userId) {
		return notFound();
	}

	const messagesFromDb = await getMessagesByChatId({
		id,
	});

	const cookieStore = await cookies();
	const modelIdFromCookie = cookieStore.get("model-id")?.value;
	const selectedModelId =
		models.find((model) => model.id === modelIdFromCookie)?.id ||
		DEFAULT_MODEL_NAME;

	return (
		<PreviewChat
			id={chat.id}
			initialMessages={convertToUIMessages(messagesFromDb)}
			selectedModelId={selectedModelId}
		/>
	);
}
