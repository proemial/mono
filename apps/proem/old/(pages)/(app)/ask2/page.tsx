import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { ChatInput } from "@/app/components/chat/chat-input";
import { ChatMessages } from "@/app/components/chat/chat-messages-ask2";
import { StarterMessages } from "@/app/components/chat/chat-starters";
import { ProemLogo } from "@/app/components/icons/brand/logo";
import { PageLayout } from "../page-layout";

const target = "ask";

export const metadata = {
	title: "proem - science answers",
};

type Props = {
	searchParams: { q: string };
};

export default async function AskPage({ searchParams }: Props) {
	return (
		<PageLayout title={target}>
			<ChatMessages message={searchParams.q}>
				<Text />
			</ChatMessages>

			<div className="flex flex-col px-2 pt-1 pb-2">
				<ChatInput target={target}>
					<StarterMessages
						target={target}
						trackingKey={analyticsKeys.ask.click.starter} />
				</ChatInput>
			</div>
		</PageLayout>
	);
}

function Text() {
	return (
		<div className="mt-auto mb-auto">
			<ProemLogo includeName />
			<div className="pt-6 text-center text-md text-white/80">
				<div>answers to your questions</div>
				<div>supported by scientific research</div>
			</div>
		</div>
	);
}
