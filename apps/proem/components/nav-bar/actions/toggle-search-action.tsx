"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { routes } from "@/routes";
import { cn } from "@proemial/shadcn-ui";
import { Plus } from "@untitled-ui/icons-react";
import { usePathname, useRouter } from "next/navigation";

export const ToggleSearchAction = () => {
	const router = useRouter();
	const pathname = usePathname();
	const isSearchPage = pathname.includes(routes.search);

	const handleAction = () => {
		const [_, space, collectionId] = pathname.split("/");

		if (isSearchPage) {
			trackHandler(analyticsKeys.ui.header.click.close);
			router.push(`/${space}/${collectionId}/saved`);
		} else {
			trackHandler(analyticsKeys.ui.header.click.search);
			router.push(`/${space}/${collectionId}${routes.search}`);
		}
	};

	return (
		<div className="p-1 cursor-pointer" onClick={handleAction}>
			<Plus
				className={cn("transition-all duration-150 ease-out size-5", {
					"rotate-45": isSearchPage,
				})}
			/>
		</div>
	);
};
