import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground uppercase text-2xs hover:bg-primary/90",
				suggestion:
					"text-left justify-start items-start text-foreground bg-card text-base leading-snug text-wrap whitespace-normal rounded-xl border-0",
				chat: "text-left justify-start text-foreground bg-primary",
				ghost: "hover:bg-inherit hover:text-inherit",
				black:
					"bg-black active:bg-slate-900 text-white border border-gray-400 normal-case rounded-xl",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10 rounded-full",
				pill: "h-6 px-4 py-2 rounded-full",
				pillLg: "h-10 p-2 pl-[18px] pb-[10px] rounded-full",
				suggestion: "rounded-2xl h-fit px-3.5 py-2 flex items-center w-full",
				actionBar: "size-5 p-0",
				none: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
