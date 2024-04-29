"use client";
import { trackHandler } from "@/app/components/analytics/tracking/tracking-keys";
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
};

export function SelectContentSelector({
	selector,
	trackingKey,
	className = "",
}: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const hadleOpenChange = (open: boolean) => {
		setIsOpen(open);
		open && trackHandler(trackingKey)();
	};

	return (
		<Select open={isOpen} onOpenChange={hadleOpenChange}>
			<SelectTrigger
				className={`border-0 w-28 focus:ring-0 focus:ring-offset-0 ${className}`}
				onPointerDown={(e) => e.preventDefault()}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<SelectValue placeholder={selector[0]?.label ?? ""} />
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
