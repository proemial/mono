"use client";

import { addAnswerAsStarter } from "@/app/(pages)/(admin)/admin/add-starter-action";
import { Button } from "@/app/components/proem-ui/button";
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
				<Input placeholder="Input a share url..." name="answerId" />
				<SubmitButton />

				<p>{state?.message}</p>
			</form>
		</>
	);
}
