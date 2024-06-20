"use client";

import { X } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	target: string;
	iconOverride?: ReactNode;
};

export const GoBackAction = ({ target, iconOverride }: Props) => {
	const router = useRouter();

	return (
		<div className="p-1 cursor-pointer" onClick={() => router.push(target)}>
			{iconOverride ?? <X className="size-5" />}
		</div>
	);
};
