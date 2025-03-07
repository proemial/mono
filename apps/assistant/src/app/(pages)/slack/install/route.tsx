import { redirect } from "next/navigation";

export async function GET() {
	return redirect(
		"https://slack.com/oauth/v2/authorize?client_id=5345137174018.8353049907607&scope=app_mentions:read,assistant:write,bookmarks:read,channels:history,channels:read,chat:write,files:read,groups:history,groups:read,groups:write,im:history,im:read,im:write,links:read,links:write,metadata.message:read,mpim:history,reactions:read,reactions:write,team:read,users:read,chat:write.customize&user_scope=",
	);
}
