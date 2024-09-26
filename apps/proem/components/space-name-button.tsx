"use client";

import React, { ReactNode } from "react";
import { useSpaces } from "../app/data/spaces";
import { Button } from "@proemial/shadcn-ui/components/ui/button";
import { useRouter } from "next/navigation";
import {
	analyticsKeys,
	trackHandler,
} from "./analytics/tracking/tracking-keys";

type Props = {
	collectionId: string;
	userId?: string | null;
	children?: ReactNode | string;
};

export function GotoSpaceButton({ collectionId, userId, children }: Props) {
	const { data: collections, isLoading } = useSpaces(collectionId, userId);
	const router = useRouter();

	const handleClick = () => {
		router.push(`/space/${collectionId}`);
		setTimeout(
			() =>
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				}),
			200,
		);
		trackHandler(analyticsKeys.read.click.spaceGoto)();
	};

	return (
		<>
			{!isLoading && collections && (
				<Button onClick={handleClick}>
					{children ? children : "View all"}
				</Button>
			)}
		</>
	);
}

export function SpaceName({ collectionId, userId, children }: Props) {
	const { data: collections, isLoading } = useSpaces(collectionId, userId);

	if (isLoading || !collections) {
		return undefined;
	}

	return (
		<>
			{`${children} "${collections?.find((c) => c.id === collectionId)?.name}"`}
		</>
	);
}
