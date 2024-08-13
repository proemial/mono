"use client";

import { AssistantData } from "@/app/api/assistant/route";
import { useAuth } from "@clerk/nextjs";
import { Drawer } from "@proemial/shadcn-ui";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { AssistantButton } from "./assistant-button";
import { AssistantContent } from "./assistant-content";

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
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { userId } = useAuth();
	const pathname = usePathname();
	const [expanded, setExpanded] = useState(false);

	const params = useParams<Params>();
	const spaceId = params.collectionId;
	const paperId = params.id;
	const { data, refetch } = useQuery({
		queryKey: [PROEM_ASSISTANT_QUERY_KEY, spaceId, paperId, userId],
		queryFn: () => getAssistantData(spaceId, paperId),
		enabled: !!spaceId || !!paperId,
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
		setDrawerOpen(true);
		setExpanded(false);
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
		<div className="fixed bottom-0 left-0 bg-gradient-to-b pt-5 from-transparent to-background h-[112px] w-full flex justify-center pointer-events-none z-20">
			<AssistantButton onClick={handleOpen} />
			<Drawer
				shouldScaleBackground={false}
				setBackgroundColorOnScale={false} // For some reason, this is not working
				open={drawerOpen}
				onOpenChange={handleOpenChange}
				// snapPoints={[0.2, 0.3]} // 1) Background color not changed until last snap point. 2) Breaks exit animation
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
