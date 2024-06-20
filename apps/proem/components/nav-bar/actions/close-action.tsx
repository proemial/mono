"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { X } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	target: string;
	iconOverride?: ReactNode;
};

export const CloseAction = ({ target, iconOverride }: Props) => {
	const router = useRouter();

	const handleAction = () => {
		trackHandler(analyticsKeys.ui.header.click.close);
		router.push(target);
	};

	return (
		<div className="p-1 cursor-pointer" onClick={handleAction}>
			{iconOverride ?? <X className="size-5" />}
		</div>
	);
};
