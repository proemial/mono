import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from "@/app/components/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                primary: "bg-[#7DFA86] text-black text-xs font-medium font-normal font-sans scale-100 active:scale-[0.98] transition-all duration-100",
                secondary: "border border-white text-white text-xs font-medium font-normal font-sans scale-100 active:scale-[0.98] transition-all duration-100",
                danger: "bg-red-600",
            },
            defaultVariants: {
                type: "primary",
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-9 px-3 rounded-md",
                lg: "h-11 px-8 rounded-md",
            },
        },
    });

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
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
