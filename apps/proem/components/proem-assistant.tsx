"use client";

import {
	Button,
	Drawer,
	DrawerContent,
	Input,
	ScrollArea,
} from "@proemial/shadcn-ui";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ProemLogo } from "./icons/brand/logo";

type Props = {
	/**
	 * @deprecated Will be remove once we launch the Proem assistant
	 */
	internalUser: boolean;
};

export const ProemAssistant = ({ internalUser }: Props) => {
	const router = useRouter();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [input, setInput] = useState("");

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const encodedInput = encodeURIComponent(input);
		setDrawerOpen(false);
		router.push(`/answer/?q=${encodedInput}`);
	};

	if (!internalUser) {
		return undefined;
	}

	return (
		<div className="fixed bottom-0 left-0 bg-gradient-to-b pt-5 from-transparent to-background h-[80px] sm:h-[100px] w-full flex justify-center pointer-events-none">
			<Button
				type="button"
				variant="default"
				size="icon"
				className="bg-white dark:bg-primary drop-shadow-xl hover:drop-shadow-lg pointer-events-auto"
				onClick={() => setDrawerOpen(true)}
			>
				<ProemLogo size="xs" />
			</Button>
			<Drawer
				shouldScaleBackground={false}
				setBackgroundColorOnScale={false} // For some reason, this is not working
				open={drawerOpen}
				onOpenChange={(openState) => setDrawerOpen(openState)}
				snapPoints={[0.2, 0.5, 0.8]} // Background color not changed until last snap point
			>
				<DrawerContent className="max-w-xl mx-auto h-full">
					<ScrollArea>
						<div className="flex flex-col gap-6 py-4 pb-5 px-3">
							<form onSubmit={handleSubmit}>
								<Input
									placeholder="Ask anything…"
									className="rounded-full bg-white dark:bg-primary border-none placeholder:opacity-75"
									value={input}
									onChange={(e) => setInput(e.target.value)}
								/>
							</form>
						</div>
					</ScrollArea>
				</DrawerContent>
			</Drawer>
		</div>
	);
};
