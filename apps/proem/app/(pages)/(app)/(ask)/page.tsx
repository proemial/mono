import { ChatPanel } from "@/components/chat-panel";

export default function AskPage() {
	const state = "empty";

	return (
		<div className="space-y-6">
			<ChatPanel state={state} />
		</div>
	);
}
