import { ProemLogo } from "@/app/components/icons/brand/logo";
import { ChatInput } from "@/components/chat-input";
import { SelectContentSelector } from "@/components/select-content-selector";
import { Suggestions } from "@/components/suggestions";
import { Header3 } from "@proemial/shadcn-ui";
import { getThreeRandomStarters } from "./starters";

export default function AskPage() {
	// TODO: Fetch top nice starters from DB
	const starters = getThreeRandomStarters();

	return (
		<div className="flex flex-col gap-4 flex-grow justify-between">
			<div className="flex flex-col flex-grow justify-center items-center gap-6">
				<ProemLogo />
				<div className="text-center">
					<Header3>Answers based on Scientific</Header3>
					<Header3>Research</Header3>
				</div>
			</div>
			<div className="flex flex-col gap-10">
				<div className="flex flex-col gap-2">
					<div className="flex justify-end">
						<SelectContentSelector
							selector={[
								{ value: "trending", label: "Trending" },
								{ value: "popular", label: "Popular", disabled: true },
								{ value: "curious", label: "Curious", disabled: true },
							]}
						/>
					</div>
					<Suggestions suggestions={starters} />
				</div>
			</div>
			<div>
				<ChatInput placeholder="Ask a question" />
			</div>
		</div>
	);
}
