import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import { Button, Header4, Input } from "@proemial/shadcn-ui";
import { ChevronRight } from "@untitled-ui/icons-react";
import { KeyboardEvent, SyntheticEvent, useState } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";

type Props = {
	paper: boolean;
	setInputFocused: (focused: boolean) => void;
	onSubmit: (input: string) => void;
};

export const AskScienceForm = ({ paper, setInputFocused, onSubmit }: Props) => {
	const [input, setInput] = useState("");
	const title = paper ? "Ask about this paper" : "Ask science";

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		trackHandler(analyticsKeys.assistant.ask.userQuestion)();
		onSubmit(input);
		setInput("");
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-1">
			<Header4 className="text-white">{title}</Header4>
			<div className="flex items-center w-full border text-foreground bg-card border-background rounded-full">
				<Input
					className={`rounded-full h-11 pl-5 resize-none flex items-center text-lg bg-card
						border-none ring-offset-0 focus-visible:ring-offset-0 focus-visible:ring-0`}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => setInputFocused(true)}
					onBlur={() => setInputFocused(false)}
					maxLength={chatInputMaxLength}
				/>
				<Button
					className="size-8 w-[36px] mr-2 rounded-full text-background border-[1px] border-theme-700 bg-theme-900 hover:bg-theme-950"
					size="icon"
					type="submit"
				>
					<ChevronRight className="size-5" />
				</Button>
			</div>
		</form>
	);
};
