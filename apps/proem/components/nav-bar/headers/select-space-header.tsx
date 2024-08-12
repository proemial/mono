"use client";

import {
	PERSONAL_DEFAULT_COLLECTION_NAME,
	getPersonalDefaultCollection,
} from "@/app/constants";
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
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation";

export type SelectSpaceHeaderProps = {
	collections: Collection[];
	onRouteChange?: (url: string) => void;
	selectedSpace?: string;
};

export const SelectSpaceHeader = ({
	collections,
	onRouteChange,
	selectedSpace,
}: SelectSpaceHeaderProps) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const handleValueChange = (id: string) => {
		trackHandler(analyticsKeys.ui.header.click.changeSpace);
		const searchPapersQuery = searchParams.get("query");
		const route = searchPapersQuery
			? // Persist URL query params when changing spaces (i.e. for search)
				`${changeSpaceId(pathname, id)}?query=${searchPapersQuery}`
			: changeSpaceId(pathname, id);

		onRouteChange?.(route);
		router.push(route);
	};
	return (
		<div className="flex items-center gap-1">
			<Select onValueChange={handleValueChange} value={selectedSpace}>
				<SelectTrigger
					data-placeholder="data placeholder"
					className="flex gap-2 text-lg border-none bg-transparent focus:ring-0 focus:ring-offset-0"
				>
					<SelectValue
						placeholder={collections.find((c) => c.id === selectedSpace)?.name}
					/>
				</SelectTrigger>
				<SelectContent
					align="center"
					className="border-none shadow-2xl min-w-64 max-w-80 rounded-xl"
				>
					<SelectGroup className="p-0 divide-y">
						{collections.map((collection) => (
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

const changeSpaceId = (pathname: string, spaceId: string) => {
	const path = pathname.includes("/space/")
		? pathname.replace(/(?<=\/space\/|^\/space\/)(\w*)(?=\/|$)/, spaceId)
		: `/space/${spaceId}/${pathname}`;

	const subpaths = path.split("/");
	return subpaths.filter((path) => path !== "saved").join("/");
};
