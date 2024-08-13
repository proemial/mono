"use client";
import { trackHandler } from "@/components/analytics/tracking/tracking-keys";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@proemial/shadcn-ui";
import { useState } from "react";

type Props = {
	selector: {
		value: string;
		label: string;
		disabled?: boolean;
	}[];
	trackingKey: string;
	className?: string;
	onValueChange?: (value: string) => void;
	staticValue?: string; // This is used for fake selectors with static values
};

export function SelectContentSelector({
	selector,
	trackingKey,
	className = "",
	onValueChange,
	staticValue,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		open && trackHandler(trackingKey)();
	};

	return (
		<Select
			{...(staticValue
				? { value: staticValue }
				: { defaultValue: selector[0]?.value })}
			open={isOpen}
			onOpenChange={handleOpenChange}
			onValueChange={onValueChange}
		>
			<SelectTrigger
				className={`border-0 w-28 focus:ring-0 focus:ring-offset-0 bg-transparent ${className}`}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent
				ref={(ref) => {
					if (!ref) return;
					ref.ontouchstart = (e) => {
						e.preventDefault();
					};
				}}
			>
				{selector.map((item, index) => (
					<SelectItem key={index} value={item.value} disabled={item.disabled}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
