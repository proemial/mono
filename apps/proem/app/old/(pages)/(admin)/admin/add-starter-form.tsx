"use client";

import { Button } from "@/app/components/shadcn-ui/button";
import { Input } from "@/app/components/shadcn-ui/input";
import { addAnswerAsStarter } from "@/app/old/(pages)/(admin)/admin/starter-action";
import { XCircleIcon } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
	error: null,
	resetKey: "reset-key",
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
			<form action={formAction} key={state?.resetKey} className="flex gap-2">
				<Input placeholder="Input a share url..." name="shareUrl" />
				<SubmitButton />
			</form>

			{state.error && (
				<div className="px-2 py-1 bg-red-500 rounded-md">
					<div className="flex items-center gap-2">
						<XCircleIcon className="text-red-300" />

						<h3 className="text-sm font-medium text-red-50">{state.error}</h3>
					</div>
				</div>
			)}
		</>
	);
}
