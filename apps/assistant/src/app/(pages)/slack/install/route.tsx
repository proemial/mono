import { redirect } from "next/navigation";

export async function GET() {
	return redirect(
		"https://slack.com/oauth/v2/authorize?client_id=5345137174018.8353049907607&scope=app_mentions:read,assistant:write,channels:history,channels:read,chat:write,files:read,groups:history,groups:read,groups:write,im:history,im:read,im:write,links:read,links:write,mpim:history,reactions:read,bookmarks:read,users:read,team:read,reactions:write,metadata.message:read&user_scope=",
	);
}
