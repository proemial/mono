"use client";

import { useAssistant } from "@/components/proem-assistant/use-assistant/use-assistant";
import { Button } from "@proemial/shadcn-ui";
import { AnnotationQuestion } from "@untitled-ui/icons-react";

export const AskAction = () => {
	const { openAssistant } = useAssistant();

	return (
		<Button size="icon" className="bg-transparent hover:bg-transparent -mr-2">
			<AnnotationQuestion className="size-5" onClick={openAssistant} />
		</Button>
	);
};
