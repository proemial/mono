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
	SelectTrigger,
	SelectValue,
} from "@proemial/shadcn-ui";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SimpleHeader } from "./simple-header";

type Props = {
	collections: Collection[];
	userId: string;
};

function changeSpaceId(pathname: string, id: string) {
	return pathname.replace(/(?<=\/space\/|^\/space\/)(\w*)(?=\/|$)/, id);
}

export const SelectSpaceHeader = ({ collections, userId }: Props) => {
	const params = useParams();
	const pathname = usePathname();
	const router = useRouter();
	const allCollections = ensureDefaultCollection(collections, userId);
	const defaultSpace = allCollections.length < 2;
	const selectedSpace =
		params.collectionId ?? userId ?? allCollections.at(0)?.id;
	console.log(selectedSpace);
	console.log(allCollections);

	const handleValueChange = (id: string) => {
		trackHandler(analyticsKeys.ui.header.click.changeSpace);
		router.push(changeSpaceId(pathname, id));
	};

	return (
		<div className="flex items-center gap-1">
			{defaultSpace && (
				<SimpleHeader title={allCollections.at(0)?.name as string} />
			)}

			{!defaultSpace && (
				<Select
					onValueChange={handleValueChange}
					value={(params.id as string | undefined) ?? userId}
				>
					<SelectTrigger className="flex gap-2 text-lg border-none">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{allCollections.map((collection) => (
								<SelectItem key={collection.id} value={collection.id}>
									{collection.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			)}
		</div>
	);
};

const ensureDefaultCollection = (collections: Collection[], userId: string) => {
	const existingDefaultCollection = collections.find(
		(collection) => collection.id === userId,
	);
	if (existingDefaultCollection) {
		return collections;
	}
	return [getPersonalDefaultCollection(userId), ...collections];
};
