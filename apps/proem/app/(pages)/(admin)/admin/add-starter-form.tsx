"use client";

import { addAnswerAsStarter } from "@/app/(pages)/(admin)/admin/add-starter-action";
import { Button } from "@/app/components/shadcn-ui/button";
import { Input } from "@/app/components/shadcn-ui/input";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
	message: "",
};

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button disabled={pending} aria-disabled={pending}>
			Add
		</Button>
	);
}

export function AddStarterForm() {
	const [state, formAction] = useFormState(addAnswerAsStarter, initialState);

	return (
		<>
			<form action={formAction}>
				<Input
					placeholder="Input a share url..."
					name="shareUrl"
					value={
						"http://localhost:4242/share/extended-cro-bfe98c0af5704262b4f580"
					}
				/>
				<SubmitButton />

				<p>{state?.message}</p>
			</form>
		</>
	);
}
