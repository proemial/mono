"use client";

import { useQuery } from "@tanstack/react-query";
import { getAvailableCollections } from "@/app/profile/actions";

export function useSpaces(collectionId?: string, userId?: string | null) {
	return useQuery({
		queryKey: ["collections-with-public", collectionId, userId],
		queryFn: async () => getAvailableCollections(collectionId),
	});
}
