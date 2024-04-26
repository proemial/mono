import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
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
		<div className="space-y-5">
			<div className="flex items-center content-center gap-3.5 font-lg">
				{/* TODO: has to be user and not you on share pagecv */}
				{isQuestionByCurrentUser ? (
					<UserAvatar trackingKey={analyticsKeys.ask.click.avatar} />
				) : (
					<User />
				)}
				<p>You</p>
			</div>

			<p className="text-2xl leading-normal">{question}</p>
		</div>
	);
}
