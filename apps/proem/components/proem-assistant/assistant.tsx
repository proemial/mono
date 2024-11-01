"use client";

import { AssistantData } from "@/app/api/assistant/route";
import { isArxivPaperId } from "@/utils/is-arxiv-paper-id";
import { useAuth } from "@clerk/nextjs";
import { cn, Drawer, DrawerTrigger } from "@proemial/shadcn-ui";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { AssistantButton } from "./assistant-button";
import { AssistantContent } from "./assistant-content";
import { useAssistant } from "./use-assistant/use-assistant";
import { useSnapPointStore } from "./use-snap-point-store";
import { routes } from "@/routes";

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
	const {
		isAssistantOpened,
		openAssistant,
		closeAssistant,
		collapseAssistant,
	} = useAssistant();
	const { userId } = useAuth();
	const pathname = usePathname();
	const { activeSnapPoint, setActiveSnapPoint, snapPoints, setSnapPoints } =
		useSnapPointStore();

	const params = useParams<Params>();
	const spaceId = params.collectionId;
	const paperId =
		params.id && isArxivPaperId(params.id) ? undefined : params.id;
	const hideAssistant =
		pathname === routes.space && !pathname.includes("paper/oa");

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
		!pathname.includes("paper/oa") &&
		DISABLED_ROUTE_FRAGMENTS.some((fragment) => pathname.includes(fragment))
	) {
		return null;
	}

	const handleOpen = () => {
		trackHandler(analyticsKeys.assistant.open)();
		openAssistant();
		collapseAssistant();
	};

	const handleOpenChange = (isOpen: boolean) => {
		// This gets triggered multiple times during transitions
		if (!isOpen) {
			trackHandler(analyticsKeys.assistant.close)();
			closeAssistant();
		} else {
			openAssistant();
			setSnapPoints([0.0, 1.0]);
			setActiveSnapPoint(1.0);
		}
	};

	const handleSetSnapPoint = (point: number | string | null) => {
		if (point === 0.0) {
			closeAssistant();
			setActiveSnapPoint(0.0);
			setSnapPoints([0.0]);
		} else {
			setActiveSnapPoint(point);
		}
	};

	return (
		<div
			className={cn(
				"fixed bottom-0 left-0 bg-gradient-to-b pt-5 from-transparent to-background h-[90px] w-full flex justify-center pointer-events-none z-20",
				{
					hidden: hideAssistant,
				},
			)}
		>
			<Drawer
				shouldScaleBackground={false}
				setBackgroundColorOnScale={false}
				open={isAssistantOpened}
				onOpenChange={handleOpenChange}
				snapPoints={snapPoints}
				activeSnapPoint={activeSnapPoint}
				setActiveSnapPoint={handleSetSnapPoint}
				modal={false}
			>
				<DrawerTrigger asChild>
					<AssistantButton onClick={handleOpen} />
				</DrawerTrigger>
				<AssistantContent spaceId={spaceId} paperId={paperId} data={data} />
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
