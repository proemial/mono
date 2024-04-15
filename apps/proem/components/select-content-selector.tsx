"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@proemial/shadcn-ui";

export function SelectContentSelector({ selector }: { selector: any[] }) {
	function onValueChange(value: string) {
		console.log("Selected value:", value);
	}

	return (
		<Select onValueChange={onValueChange}>
			<SelectTrigger className="border-0 w-28 focus:ring-0 focus:ring-offset-0">
				<SelectValue placeholder={selector[0].label} />
			</SelectTrigger>
			<SelectContent>
				{selector.map((item, index) => (
					<SelectItem key={index} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
