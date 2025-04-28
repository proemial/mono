"use client";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
	return (
		<button
			type="button"
			onClick={() => history.back()}
			className="text-[#000000] hover:text-[#d4d3c8] flex gap-1 mb-3 max-[475px]:hidden"
		>
			<ArrowLeft className="size-6" /> Back
		</button>
	);
}
