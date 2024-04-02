"use client";

import { removeAnswerAsStarter } from "@/app/(pages)/(admin)/admin/starter-action";
import { Button } from "@/app/components/shadcn-ui/button";

export function DeleteStarterButton({
	id,
}: { id: Parameters<typeof removeAnswerAsStarter>[0] }) {
	return <Button onClick={() => removeAnswerAsStarter(id)}>Delete</Button>;
}
