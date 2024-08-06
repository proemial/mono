import { Button, ButtonProps } from "@proemial/shadcn-ui";
import { Check } from "@untitled-ui/icons-react";
import { PlusCircle } from "lucide-react";
import { ForwardedRef, forwardRef } from "react";

type AddButtonProps = Pick<ButtonProps, "onClick"> & {
	isChecked: boolean;
};

export function AddButton({ isChecked, onClick }: AddButtonProps) {
	return (
		<Button variant="ghost" type="button" size="icon" onClick={onClick}>
			{isChecked ? (
				<div className="size-6 bg-foreground/80 text-white rounded-full flex items-center justify-center">
					<Check className="size-4" />
				</div>
			) : (
				<PlusCircle className="size-6 stroke-1" />
			)}
		</Button>
	);
}

export const AddButtonSkeleton = forwardRef(
	(props, ref: ForwardedRef<HTMLButtonElement>) => {
		return (
			<Button variant="ghost" type="button" size="icon" ref={ref} {...props}>
				<PlusCircle className="size-6 stroke-1" />
			</Button>
		);
	},
);
