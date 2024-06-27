import { Button } from "@proemial/shadcn-ui";
import { Check } from "@untitled-ui/icons-react";
import { PlusCircle } from "lucide-react";
import { ForwardedRef, forwardRef } from "react";

type AddButtonProps = {
	isChecked: boolean;
	onClick: () => void;
};

export function AddButton({ isChecked, onClick }: AddButtonProps) {
	return (
		<Button variant="ghost" type="button" size="icon" onClick={onClick}>
			{isChecked ? (
				<div className="size-4 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
					<Check className="size-2.5" />
				</div>
			) : (
				<PlusCircle className="size-4" />
			)}
		</Button>
	);
}

export const AddButtonSkeleton = forwardRef(
	(props, ref: ForwardedRef<HTMLButtonElement>) => {
		return (
			<Button variant="ghost" type="button" size="icon" ref={ref} {...props}>
				<PlusCircle className="size-4" />
			</Button>
		);
	},
);
