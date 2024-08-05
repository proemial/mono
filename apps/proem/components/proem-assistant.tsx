"use client";

import { getThreeRandomStarters } from "@/app/(pages)/(app)/ask/starters";
import { chatInputMaxLength } from "@/app/api/bot/input-limit";
import { routes } from "@/routes";
import {
	Button,
	Drawer,
	DrawerContent,
	Header4,
	ScrollArea,
	Textarea,
} from "@proemial/shadcn-ui";
import { DialogTitle } from "@proemial/shadcn-ui/components/ui/dialog";
import { ChevronRight, RefreshCcw01 } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, SyntheticEvent, useMemo, useState } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "./analytics/tracking/tracking-keys";
import { ProemLogo } from "./icons/brand/logo";
import { MoodSelector } from "./mood-selector";
import { Suggestions } from "./suggestions";

export const ProemAssistant = () => {
	const router = useRouter();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [input, setInput] = useState("");
	const [regenStarters, setRegenStarters] = useState(false); // Flip this boolean to regenerate starters
	const starters = useMemo(
		() => (regenStarters ? getThreeRandomStarters() : getThreeRandomStarters()),
		[regenStarters],
	);

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		const encodedInput = encodeURIComponent(input);
		setDrawerOpen(false);
		trackHandler(analyticsKeys.assistant.ask);
		router.push(`${routes.answer}/?q=${encodedInput}`);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleOpen = () => {
		trackHandler(analyticsKeys.assistant.open);
		setDrawerOpen(true);
	};

	const handleOpenChange = (open: boolean) => {
		// This gets triggered multiple times during transitions
		if (!open) {
			trackHandler(analyticsKeys.assistant.close);
			setDrawerOpen(false);
		} else {
			setDrawerOpen(open);
		}
	};

	return (
		<div className="fixed bottom-0 left-0 bg-gradient-to-b pt-5 from-transparent to-background h-[80px] sm:h-[100px] w-full flex justify-center pointer-events-none">
			<Button
				type="button"
				variant="default"
				size="icon"
				className="bg-white drop-shadow-xl hover:drop-shadow-lg pointer-events-auto"
				onClick={handleOpen}
			>
				<ProemLogo size="xs" />
			</Button>
			<Drawer
				shouldScaleBackground={false}
				setBackgroundColorOnScale={false} // For some reason, this is not working
				open={drawerOpen}
				onOpenChange={handleOpenChange}
				// snapPoints={[0.2, 0.3]} // 1) Background color not changed until last snap point. 2) Breaks exit animation
			>
				<DrawerContent className="max-w-xl mx-auto">
					<DialogTitle className="hidden" />
					<ScrollArea>
						<div className="flex flex-col gap-6 py-4 pb-5 px-3">
							<form onSubmit={handleSubmit} className="flex flex-col gap-2">
								<Header4>Ask Science</Header4>
								<div className="flex items-center w-full border text-foreground bg-card border-background rounded-3xl">
									<Textarea
										className="rounded-full h-11 pl-5 resize-none flex items-center text-lg bg-card"
										onChange={(e) => setInput(e.target.value)}
										onKeyDown={handleKeyDown}
										maxLength={chatInputMaxLength}
									/>
									<Button
										className="size-8 w-[36px] mr-2 rounded-full text-background border-[1px] bg-foreground disabled:opacity-1"
										size="icon"
										type="submit"
										onClick={trackHandler(analyticsKeys.chat.click.submit)}
									>
										<ChevronRight className="size-5" />
									</Button>
								</div>
							</form>
							<div className="flex flex-col gap-2">
								<div className="flex justify-between items-center -mr-2">
									<Header4>Suggested Questions</Header4>
									<MoodSelector trackingPrefix="ask" />
								</div>
								<Suggestions
									suggestions={starters}
									trackingPrefix="ask"
									starters
								/>
								<Button
									className="size-8 rounded-full border-[1px] self-center"
									size="icon"
									type="button"
									onClick={() => setRegenStarters(!regenStarters)}
								>
									<RefreshCcw01 className="size-4" />
								</Button>
							</div>
						</div>
					</ScrollArea>
				</DrawerContent>
			</Drawer>
		</div>
	);
};
