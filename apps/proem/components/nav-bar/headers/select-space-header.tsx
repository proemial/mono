"use client";

import { PERSONAL_DEFAULT_COLLECTION_NAME } from "@/app/constants";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { useRecentSpaces } from "@/components/nav-bar/headers/use-recent-spaces";
import { Collection } from "@proemial/data/neon/schema";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@proemial/shadcn-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SelectSpaceHeaderProps = {
	spaces: Collection[];
	selectedSpaceId?: string;
	onRouteChange?: ({ url, name }: { url: string; name?: string }) => void;
};

export const SelectSpaceHeader = ({
	spaces,
	selectedSpaceId,
	onRouteChange,
}: SelectSpaceHeaderProps) => {
	const router = useRouter();
	const { recentSpaces, addSpace } = useRecentSpaces();

	useEffect(() => {
		if (selectedSpaceId) {
			addSpace(selectedSpaceId);
		}
	}, [addSpace, selectedSpaceId]);

	const handleValueChange = (id: string) => {
		trackHandler(analyticsKeys.ui.header.click.changeSpace)();
		const selectedCollection = spaces.find((c) => c.id === id);
		const route = `/space/${id}`;
		onRouteChange?.({ url: route, name: selectedCollection?.name });
		router.push(route);
	};

	return (
		<div className="flex items-center gap-1">
			<Select onValueChange={handleValueChange} value={selectedSpaceId}>
				<SelectTrigger
					data-placeholder="data placeholder"
					className="flex gap-2 text-lg border-none bg-transparent focus:ring-0 focus:ring-offset-0"
				>
					<SelectValue
						placeholder={spaces.find((c) => c.id === selectedSpaceId)?.name}
					/>
				</SelectTrigger>
				<SelectContent
					align="center"
					className="border-none shadow-2xl min-w-64 max-w-80 rounded-xl"
				>
					<SelectGroup className="p-0 divide-y">
						{spaces.map((collection) => (
							<SelectItem
								key={collection.id}
								value={collection.id}
								className="py-2 text-base cursor-pointer"
							>
								{collection.id.includes("user_")
									? PERSONAL_DEFAULT_COLLECTION_NAME
									: collection.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};
