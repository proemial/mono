"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@proemial/shadcn-ui";

type Props = {
	selector: {
		value: string;
		label: string;
		disabled?: boolean;
	}[];
};

export function SelectContentSelector({ selector }: Props) {
	function onValueChange(value: string) {
		// TODO: Implement
	}

	return (
		<Select onValueChange={onValueChange}>
			<SelectTrigger className="border-0 w-28 focus:ring-0 focus:ring-offset-0 float-end">
				<SelectValue placeholder={selector[0]?.label ?? ""} />
			</SelectTrigger>
			<SelectContent>
				{selector.map((item, index) => (
					<SelectItem key={index} value={item.value} disabled={item.disabled}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
