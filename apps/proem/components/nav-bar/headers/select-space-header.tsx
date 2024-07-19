"use client";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getActiveSpace } from "./active-space";

type Props = {
	collections: Collection[];
	userId: string | null;
	collectionId?: string;
};

export const SelectSpaceHeader = ({
	collections,
	userId,
	collectionId,
}: Props) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const { collectionsWithDefaultFallback, selectedSpace } = getActiveSpace(
		collections,
		userId,
		collectionId,
	);

	const handleValueChange = (id: string) => {
		trackHandler(analyticsKeys.ui.header.click.changeSpace);
		const searchPapersQuery = searchParams.get("query");
		if (searchPapersQuery) {
			// Persist URL query params when changing spaces (i.e. for search)
			router.push(`${changeSpaceId(pathname, id)}?query=${searchPapersQuery}`);
		} else {
			router.push(changeSpaceId(pathname, id));
		}
	};

	return (
		<div className="flex items-center gap-1">
			<Select onValueChange={handleValueChange} value={selectedSpace}>
				<SelectTrigger className="flex gap-2 text-lg border-none">
					<SelectValue />
				</SelectTrigger>
				<SelectContent
					align="center"
					className="border-none shadow-2xl min-w-64 max-w-80 rounded-xl"
				>
					<SelectGroup className="p-0 divide-y">
						{collectionsWithDefaultFallback.map((collection) => (
							<SelectItem
								key={collection.id}
								value={collection.id}
								className="py-2 text-base cursor-pointer"
							>
								{collection.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

const changeSpaceId = (pathname: string, spaceId: string) => {
	const path = pathname.replace(
		/(?<=\/space\/|^\/space\/)(\w*)(?=\/|$)/,
		spaceId,
	);
	const subpaths = path.split("/");
	return subpaths.filter((path) => path !== "saved").join("/");
};
