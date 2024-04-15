import { Avatar, AvatarFallback, AvatarImage } from "@proemial/shadcn-ui";

export function ChatQuestion({ question }: { question: string }) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Avatar className="size-6">
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<p>You</p>
			</div>

			<p className="text-2xl px-1 md:max-w-[550px]">{question}</p>
		</div>
	);
}
