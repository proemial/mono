"use client";

import { getPersonalDefaultCollection } from "@/app/constants";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Collection } from "@proemial/data/neon/schema";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@proemial/shadcn-ui";
import { useParams, useRouter } from "next/navigation";

type Props = {
	collections: Collection[];
	userId: string;
};

export const SelectSpaceHeader = ({ collections, userId }: Props) => {
	const params = useParams();
	const router = useRouter();
	const allCollections = ensureDefaultCollection(collections, userId);

	const handleValueChange = (value: string) => {
		trackHandler(analyticsKeys.ui.header.click.changeSpace);
		router.push(`/collection/${value}`);
	};

	return (
		<div className="flex gap-1 items-center">
			<Select
				onValueChange={handleValueChange}
				value={(params.id as string | undefined) ?? userId}
			>
				<SelectTrigger className="border-none flex gap-2 text-lg">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Switch Space</SelectLabel>
						{allCollections.map((collection) => (
							<SelectItem key={collection.id} value={collection.slug}>
								{collection.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

const ensureDefaultCollection = (collections: Collection[], userId: string) => {
	const existingDefaultCollection = collections.find(
		(collection) => collection.slug === userId,
	);
	if (existingDefaultCollection) {
		return collections;
	}
	return [getPersonalDefaultCollection(userId), ...collections];
};
