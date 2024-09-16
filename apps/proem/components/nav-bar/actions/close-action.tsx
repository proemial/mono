"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { X } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	/**
	 * The target URL to navigate to when closing.
	 * If not provided or empty, will use router.back() instead.
	 */
	target?: string;
	iconOverride?: ReactNode;
};

export const CloseAction = ({ target, iconOverride }: Props) => {
	const router = useRouter();

	const handleAction = () => {
		trackHandler(analyticsKeys.ui.header.click.close)();
		if (target) {
			router.push(target);
		} else {
			router.back();
		}
	};

	return (
		<div className="p-1 cursor-pointer" onClick={handleAction}>
			{iconOverride ?? <X className="size-5" />}
		</div>
	);
};
