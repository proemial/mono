import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { User } from "./icons/User";

export type ChatQuestionProps = {
	question?: string;
	isQuestionByCurrentUser: boolean;
};

export function ChatQuestion({
	question,
	isQuestionByCurrentUser,
}: ChatQuestionProps) {
	const { isSignedIn, user, isLoaded } = useUser();
	const showUserAvatar = isSignedIn && isLoaded && user.hasImage;

	if (!question) {
		return;
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				{showUserAvatar ? (
					<Image
						src={user.imageUrl}
						alt=""
						width="24"
						height="24"
						className="rounded-full"
					/>
				) : (
					<User />
				)}

				<p>{isQuestionByCurrentUser ? "You" : "User"}</p>
			</div>

			<p className="text-2xl px-1 md:max-w-[550px]">{question}</p>
		</div>
	);
}
