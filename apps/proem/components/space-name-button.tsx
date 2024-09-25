"use client";

import React from "react";
import { useSpaces } from "../app/data/spaces";
import { Button } from "@proemial/shadcn-ui/components/ui/button";
import { useRouter } from "next/navigation";

export function SpaceNameButton({
	collectionId,
	userId,
}: { collectionId: string; userId?: string | null }) {
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
	};

	return (
		<>
			{!isLoading && collections && (
				<Button onClick={handleClick}>
					{`More papers from ${collections?.find((c) => c.id === collectionId)?.name}`}
				</Button>
			)}
		</>
	);
}
