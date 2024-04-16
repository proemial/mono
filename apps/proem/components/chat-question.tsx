export type ChatQuestionProps = {
	question?: string;
	isQuestionByCurrentUser: boolean;
};

export function ChatQuestion({
	question,
	isQuestionByCurrentUser,
}: ChatQuestionProps) {
	if (!question) {
		return;
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<div className="rounded-full size-6 bg-primary" />

				<p>{isQuestionByCurrentUser ? "You" : "User"}</p>
			</div>

			<p className="text-2xl px-1 md:max-w-[550px]">{question}</p>
		</div>
	);
}
