import { ChatInput } from "@/components/chat-input";
import { ProemLogo } from "@/components/icons/brand/logo";
import { Main } from "@/components/main";
import { MoodSelector } from "@/components/mood-selector";
import { GoBackAction } from "@/components/nav-bar/actions/go-back-action";
import { AskHeader } from "@/components/nav-bar/headers/ask-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { Suggestions } from "@/components/suggestions";
import { Metadata } from "next";
import { getThreeRandomStarters } from "./starters";

export const metadata: Metadata = {
	robots: {
		index: true,
		follow: true,
	},
};

export default function AskPage() {
	// TODO: Fetch top nice starters from DB
	const starters = getThreeRandomStarters();

	return (
		<>
			<NavBarV2 action={<GoBackAction />}>
				<AskHeader />
			</NavBarV2>
			<Main>
				<div className="flex flex-col justify-between flex-grow gap-4">
					<div className="flex flex-col items-center justify-center flex-grow gap-6">
						<ProemLogo size="md" />
						<div className="text-xl text-center">
							<div>Answers based on Scientific</div>
							<div>Research</div>
						</div>
					</div>
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-2">
							<div className="flex justify-end -mr-2">
								<MoodSelector trackingPrefix="ask" />
							</div>
							<Suggestions
								suggestions={starters}
								trackingPrefix="ask"
								starters
							/>
						</div>
					</div>
					<div>
						<ChatInput placeholder="Ask a question" trackingPrefix="ask" />
					</div>
				</div>
			</Main>
		</>
	);
}
