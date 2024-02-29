import { Send } from "@/app/components/icons/functional/send";
import { Button } from "@/app/components/shadcn-ui/button";
import { Input } from "@/app/components/shadcn-ui/input";
import { ChangeEvent } from "react";

type Props = {
	value?: string;
	disabled?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
};

export function TextInput({ value, disabled, onChange, placeholder }: Props) {
	return (
		<>
			<Input
				type="text"
				name="q"
				placeholder={placeholder}
				className="relative pr-12 break-words stretch"
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
			<Button
				variant="send_button"
				size="sm"
				type="submit"
				className="absolute justify-center bg-transparent right-2"
				disabled={disabled}
			>
				<Send />
			</Button>
		</>
	);
}
