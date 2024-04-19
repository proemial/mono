import { UserAvatar } from "@/app/components/user-avatar";
import { User } from "@/components/icons/User";

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
				{/* TODO: has to be user and not you on share pagecv */}
				{isQuestionByCurrentUser ? (
					<>
						<UserAvatar />
						<p>You</p>
					</>
				) : (
					<>
						<User />
						<p>You</p>
					</>
				)}
			</div>

			<p className="text-2xl px-1 md:max-w-[550px]">{question}</p>
		</div>
	);
}
