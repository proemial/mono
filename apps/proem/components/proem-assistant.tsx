"use client";

import { useInternalUser } from "@/app/hooks/use-user";
import {
	Button,
	Drawer,
	DrawerContent,
	Input,
	ScrollArea,
} from "@proemial/shadcn-ui";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ProemLogo } from "./icons/brand/logo";

// Do not show on ASK page
const IGNORED_PATHS = ["/"];

type Props = {
	/**
	 * @deprecated Will be remove once we launch the Proem assistant
	 */
	internalUser: boolean;
};

export const ProemAssistant = ({ internalUser }: Props) => {
	const pathname = usePathname();
	const router = useRouter();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [input, setInput] = useState("");

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const encodedInput = encodeURIComponent(input);
		setDrawerOpen(false);
		router.push(`/answer/?q=${encodedInput}`);
	};

	if (IGNORED_PATHS.includes(pathname) || !internalUser) {
		return undefined;
	}

	return (
		<div className="fixed bottom-0 left-0 bg-gradient-to-b pt-5 from-transparent to-background h-[100px] w-full flex justify-center pointer-events-none">
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
				setBackgroundColorOnScale={false}
				open={drawerOpen}
				onOpenChange={(openState) => setDrawerOpen(openState)}
			>
				<DrawerContent>
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
