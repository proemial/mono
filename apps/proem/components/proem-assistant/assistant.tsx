"use client";

import { AssistantData } from "@/app/api/assistant/route";
import { isArxivPaperId } from "@/utils/is-arxiv-paper-id";
import { useAuth } from "@clerk/nextjs";
import { Drawer } from "@proemial/shadcn-ui";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { AssistantButton } from "./assistant-button";
import { AssistantContent } from "./assistant-content";
import { useAssistant } from "./use-assistant";
import { useSnapPointStore } from "./use-snap-point-store";

export const PROEM_ASSISTANT_QUERY_KEY = "proem-assistant";

// Do not show the assistant on routes containing these fragments
const DISABLED_ROUTE_FRAGMENTS = [
	"/ask",
	"/blocked",
	"/new",
	"/rss",
	"/search",
	"/share",
];

type Params = {
	collectionId?: string;
	id?: string;
};

export const ProemAssistant = () => {
	const { isOpen, open, close } = useAssistant();
	const { userId } = useAuth();
	const pathname = usePathname();
	const [expanded, setExpanded] = useState(false);
	const { snapPoint, setSnapPoint } = useSnapPointStore();

	const params = useParams<Params>();
	const spaceId = params.collectionId;
	const paperId =
		params.id && isArxivPaperId(params.id) ? undefined : params.id;

	const { data, refetch } = useQuery({
		queryKey: [PROEM_ASSISTANT_QUERY_KEY, spaceId, paperId, userId],
		queryFn: () => getAssistantData(spaceId, paperId),
	});

	// Poll for paper starters until they are generated (for in-context starters)
	useEffect(() => {
		const interval = setInterval(() => {
			if (paperId && !data?.paper?.generated?.starters) {
				refetch();
			} else {
				clearInterval(interval);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [paperId, data, refetch]);

	if (
		DISABLED_ROUTE_FRAGMENTS.some((fragment) => pathname.includes(fragment))
	) {
		return undefined;
	}

	const handleOpen = () => {
		trackHandler(analyticsKeys.assistant.open);
		open();
		setExpanded(false);
	};

	const handleOpenChange = (isOpen: boolean) => {
		// This gets triggered multiple times during transitions
		if (!isOpen) {
			trackHandler(analyticsKeys.assistant.close);
			close();
		} else {
			open();
		}
	};

	return (
		<div className="fixed bottom-0 left-0 bg-gradient-to-b pt-5 from-transparent to-background h-[112px] w-full flex justify-center pointer-events-none z-20">
			<AssistantButton onClick={handleOpen} />
			<Drawer
				shouldScaleBackground={false}
				setBackgroundColorOnScale={false}
				open={isOpen}
				onOpenChange={handleOpenChange}
				snapPoints={[snapPoint]}
				activeSnapPoint={snapPoint}
				setActiveSnapPoint={setSnapPoint}
			>
				<AssistantContent
					spaceId={spaceId}
					paperId={paperId}
					data={data}
					expanded={expanded}
					setExpanded={setExpanded}
				/>
			</Drawer>
		</div>
	);
};

const getAssistantData = async (
	spaceId: string | undefined,
	paperId: string | undefined,
) => {
	const response = await fetch("/api/assistant", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ spaceId, paperId }),
	});
	return response.json() as Promise<AssistantData>;
};
