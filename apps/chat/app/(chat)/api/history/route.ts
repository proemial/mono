import { getSessionId } from "@/app/(auth)/sessionid";
import { getChatsByUserId } from "@/db/queries";

export async function GET() {
	const sessionId = await getSessionId();

	if (!sessionId) {
		return Response.json("Unauthorized!", { status: 401 });
	}

	const chats = await getChatsByUserId({ id: sessionId });
	return Response.json(chats);
}
