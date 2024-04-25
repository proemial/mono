"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/app/components/analytics/tracking/tracking-keys";
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
		<Select
			onValueChange={onValueChange}
			onOpenChange={(open) =>
				open && trackHandler(analyticsKeys.ask.click.suggestionsCategory)()
			}
		>
			<SelectTrigger className="border-0 w-28 focus:ring-0 focus:ring-offset-0">
				<SelectValue placeholder={selector[0]?.label ?? ""} />
			</SelectTrigger>
			<SelectContent>
				{selector.map((item, index) => (
					<SelectItem
						key={index}
						value={item.value}
						disabled={item.disabled}
						className="pointer-events-none"
					>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
