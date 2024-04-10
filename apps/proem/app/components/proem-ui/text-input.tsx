import { Send } from "@/app/components/icons/functional/send";
import { Button } from "@/app/components/shadcn-ui/button";
import { Input } from "@/app/components/shadcn-ui/input";
import { ChangeEvent } from "react";

type Props = {
	placeholder: string;
	value?: string;
	disabled?: boolean;
	readonly?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	onFocus?: () => void;
	onFocusChange?: (focus: boolean) => void;
	maxLength?: number;
};

export function TextInput(props: Props) {
	const {
		value,
		placeholder,
		disabled,
		readonly,
		onChange,
		onFocus,
		onFocusChange,
		maxLength
	} = props;

	const handleFocusChange = (focus: boolean) => {
		if (focus && onFocus) {
			onFocus();
		}
		if (onFocusChange) {
			onFocusChange(focus);
		}
	};

	return (
		<>
			<Input
				type="text"
				name="q"
				placeholder={placeholder}
				className="relative pr-12 break-words stretch"
				value={value}
				onChange={onChange}
				onFocus={() => {
					handleFocusChange(true);
				}}
				onBlur={() => handleFocusChange(false)}
				disabled={disabled}
				readOnly={readonly}
				maxLength={maxLength}
			/>
			<Button
				variant="send_button"
				size="sm"
				type="submit"
				className="absolute justify-center bg-transparent right-2"
				disabled={disabled || readonly}
			>
				<Send />
			</Button>
		</>
	);
}
