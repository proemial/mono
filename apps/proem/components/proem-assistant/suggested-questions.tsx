import { getThreeRandomStarters } from "@/app/(pages)/(app)/ask/starters";
import { Button, Header4 } from "@proemial/shadcn-ui";
import { RefreshCcw01 } from "@untitled-ui/icons-react";
import { motion } from "framer-motion";
import { ForwardedRef, forwardRef, useMemo, useState } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { MoodSelector } from "../mood-selector";
import { Suggestions } from "../suggestions";

type Props = {
	hidden: boolean;
	height: number;
	onSubmit: (input: string) => void;
	suggestions: string[];
	suggestionType: "generated" | "followup";
};

export const SuggestedQuestions = forwardRef(
	(
		{ hidden, height, onSubmit, suggestions, suggestionType }: Props,
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		const [regenStarters, setRegenStarters] = useState(false); // Flip this boolean to regenerate starters
		const randomStarters = useMemo(
			() =>
				regenStarters ? getThreeRandomStarters() : getThreeRandomStarters(),
			[regenStarters],
		);
		const showStarters = suggestions.length === 0;

		const handleRegen = () => {
			trackHandler(analyticsKeys.assistant.regenSuggestions)();
			setRegenStarters(!regenStarters);
		};

		return (
			<motion.div
				animate={{
					opacity: hidden ? 0 : 1,
					marginBottom: hidden ? -height : 0,
				}}
				ref={ref}
			>
				<div className="flex justify-between items-center -mr-2">
					<Header4 className="text-white">Suggested questions</Header4>
					<MoodSelector trackingPrefix="ask" className="text-white" />
				</div>
				<div className="flex flex-col gap-2 items-center">
					<Suggestions
						suggestions={showStarters ? randomStarters : suggestions}
						onClick={onSubmit}
						type={showStarters ? "starter" : suggestionType}
					/>
					{showStarters && (
						<Button
							className="size-8 rounded-full border-[1px] self-center border-theme-700 bg-theme-900 hover:bg-theme-950 text-white"
							size="icon"
							type="button"
							onClick={handleRegen}
						>
							<RefreshCcw01 className="size-4" />
						</Button>
					)}
				</div>
			</motion.div>
		);
	},
);
