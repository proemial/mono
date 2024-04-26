"use client";

import { Button } from "@/app/components/shadcn-ui/button";
import { removeAnswerAsStarter } from "@/old/(pages)/(admin)/admin/starter-action";

export function DeleteStarterButton({
	id,
}: { id: Parameters<typeof removeAnswerAsStarter>[0] }) {
	return <Button onClick={() => removeAnswerAsStarter(id)}>Delete</Button>;
}
