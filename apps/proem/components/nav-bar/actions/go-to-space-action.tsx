"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { routes } from "@/routes";
import { Button } from "@proemial/shadcn-ui";
import { ChevronLeft } from "@untitled-ui/icons-react";
import { useParams, useRouter } from "next/navigation";

/**
 * Go back to the selected space. If no space is selected, go to `/space`.
 */
export const GoToSpaceAction = () => {
	const router = useRouter();
	const { collectionId } = useParams<{ collectionId?: string }>();

	const handleAction = () => {
		trackHandler(analyticsKeys.ui.header.click.back);
		if (collectionId) {
			router.push(`${routes.space}/${collectionId}`);
		} else {
			router.push(routes.space);
		}
	};

	return (
		<Button
			variant="ghost"
			type="button"
			size="icon"
			className="-ml-3"
			onClick={handleAction}
		>
			<ChevronLeft className="size-5" />
		</Button>
	);
};
