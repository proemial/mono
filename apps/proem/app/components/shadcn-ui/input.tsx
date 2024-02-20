import { cn } from "@/app/components/shadcn-ui/utils";
import * as React from "react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex w-full text-[16px] font-normal rounded bg-[#1A1A1A] border border-[#4E4E4E] text-white placeholder-green-500 px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
