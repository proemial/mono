"use client";

import { PERSONAL_DEFAULT_COLLECTION_NAME } from "@/app/constants";
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
import { useRouter } from "next/navigation";

type SelectSpaceHeaderProps = {
	collections: Collection[];
	onRouteChange?: ({ url, name }: { url: string; name?: string }) => void;
	selectedSpace?: string;
};

export const SelectSpaceHeader = ({
	collections,
	onRouteChange,
	selectedSpace,
}: SelectSpaceHeaderProps) => {
	const router = useRouter();

	const handleValueChange = (id: string) => {
		trackHandler(analyticsKeys.ui.header.click.changeSpace)();
		const selectedCollection = collections.find((c) => c.id === id);
		const route = `/space/${id}`;
		onRouteChange?.({ url: route, name: selectedCollection?.name });
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
