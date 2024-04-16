import { User01 } from "@untitled-ui/icons-react";

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
				<User01 />

				<p>{isQuestionByCurrentUser ? "You" : "User"}</p>
			</div>

			<p className="text-2xl px-1 md:max-w-[550px]">{question}</p>
		</div>
	);
}
