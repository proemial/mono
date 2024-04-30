import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
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
			<div className="flex items-center content-center gap-3.5 text-lg leading-6">
				{isQuestionByCurrentUser ? (
					<>
						<UserAvatar trackingKey={analyticsKeys.ask.click.avatar} />
						<p>You</p>
					</>
				) : (
					<>
						<User />
						<p>User</p>
					</>
				)}
			</div>

			<p className="text-2xl leading-normal">{question}</p>
		</div>
	);
}
