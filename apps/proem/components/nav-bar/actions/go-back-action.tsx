"use client";

import { X } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";

export const GoBackAction = () => {
	const router = useRouter();

	return (
		<div className="p-1 cursor-pointer" onClick={() => router.back()}>
			<X className="size-5" />
		</div>
	);
};
