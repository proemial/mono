"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { routes } from "@/routes";
import { SearchMd } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";

export const OpenSearchAction = () => {
	const router = useRouter();

	const handleAction = () => {
		trackHandler(analyticsKeys.ui.header.click.search);
		router.push(routes.search);
	};

	return (
		<div className="p-1 cursor-pointer" onClick={handleAction}>
			<SearchMd className="size-5" />
		</div>
	);
};
