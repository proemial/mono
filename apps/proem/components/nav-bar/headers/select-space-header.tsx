"use client";

import { PERSONAL_DEFAULT_COLLECTION_NAME } from "@/app/constants";
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

	const selectedCollection = collections.find(
		(collection) => collection.slug === params.id,
	);
	const defaultCollection = {
		id: userId,
		name: PERSONAL_DEFAULT_COLLECTION_NAME,
	};

	const handleValueChange = (value: string) => {
		router.push(`/collection/${value}`);
	};

	return (
		<div className="flex gap-1 items-center">
			<Select
				onValueChange={handleValueChange}
				value={selectedCollection?.slug ?? defaultCollection.id}
			>
				<SelectTrigger className="border-none flex gap-2 text-lg">
					<SelectValue
						placeholder={selectedCollection?.name ?? defaultCollection.name}
					/>
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Switch Space</SelectLabel>
						{collections?.map((collection) => (
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
