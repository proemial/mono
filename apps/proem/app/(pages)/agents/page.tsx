import { ChatWindow } from "./components/ChatWindow";

export default function AgentsPage() {
    return (
        <ChatWindow
            endpoint="api/agents"
            emptyStateComponent={<div />}
            titleText="Agents"
            emoji="🦜"
            showIntermediateStepsToggle={true}
        />
    );
}