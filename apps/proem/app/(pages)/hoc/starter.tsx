"use client";
import { StarterButton } from "@/app/components/proem-ui/link-button";
import { useAskState } from "../../components/chat/state";

export function Starter({ children }: { children: string }) {
	const { appendQuestion } = useAskState();

	return (
		<StarterButton
			variant="starter"
			className="w-full cursor-pointer"
			onClick={() => appendQuestion(children)}
		>
			{children}
		</StarterButton>
	);
}
