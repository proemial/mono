"use client";

import { PERSONAL_DEFAULT_COLLECTION_NAME } from "@/app/constants";
import { getCollections } from "@/app/profile/actions";
import { useUser } from "@clerk/nextjs";
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
import { useQuery } from "react-query";

export const SelectSpaceHeader = () => {
	const { user } = useUser();
	const params = useParams();
	const router = useRouter();

	const { data: collections } = useQuery({
		queryKey: ["collections", user?.id],
		queryFn: async () => getCollections(user?.id ?? ""),
		enabled: !!user?.id,
	});

	const collectionName =
		collections?.find((collection) => collection.slug === params.id)?.name ??
		PERSONAL_DEFAULT_COLLECTION_NAME;
	const defaultCollectionId = user?.id;

	const handleValueChange = (value: string) => {
		router.push(`/collection/${value}`);
	};

	return (
		<div className="flex gap-1 items-center">
			<Select
				onValueChange={handleValueChange}
				value={(params.id as string) ?? defaultCollectionId}
			>
				<SelectTrigger className="border-none flex gap-2 text-lg">
					<SelectValue placeholder={collectionName} />
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
