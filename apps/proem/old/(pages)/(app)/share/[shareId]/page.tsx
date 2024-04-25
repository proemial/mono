import { answers } from "@/app/api/bot/answer-engine/answers";
import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { ChatInput } from "@/app/components/chat/chat-input";
import { ChatMessages } from "@/app/components/chat/chat-messages-ask";
import { StarterMessages } from "@/app/components/chat/chat-starters";
import { redirect } from "next/navigation";
import { PageLayout } from "../../page-layout";

const target = "ask";

export const revalidate = 1;
export const metadata = {
	title: "proem - science answers",
};

type Props = {
	params: { shareId: string };
};

export default async function SharePage({ params: { shareId } }: Props) {
	const [sharedAnswer] = await answers.getByShareId(shareId);

	if (!sharedAnswer) {
		redirect("/");
	}

	return (
		<PageLayout title={target}>
			<div>
				<ChatMessages
					existingShareId={sharedAnswer.shareId ?? undefined}
					initialMessages={[
						{ id: "id", role: "assistant", content: sharedAnswer.answer },
					]} />
			</div>

			<div className="flex flex-col px-2 pt-1 pb-2">
				<ChatInput target={target}>
					<StarterMessages
						target={target}
						trackingKey={"analyticsKeys.ask.click.starter"} />
				</ChatInput>
			</div>
		</PageLayout>
	);
}
