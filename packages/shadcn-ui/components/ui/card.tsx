"use client";

import { cva } from "class-variance-authority";
import { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const cardVariants = cva(
	"rounded-lg border dark:border-0 bg-card text-card-foreground",
	{
		variants: {
			variant: {
				default: "",
				paper: "w-40 h-48",
			},
		},
	},
);

const cardHeaderVariants = cva(
	"flex flex-row place-content-between p-2 items-center ",
	{
		variants: {
			variant: {
				default: "",
				paperDiscover: "px-[10px]",
				paperAsk: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const cardTitleVariants = cva(
	"text-2xl font-semibold leading-none tracking-tight ",
	{
		variants: {
			variant: {
				default: "",
				paper: "text-sm font-normal text-center text-wrap whitespace-normal",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const cardDescriptionVariants = cva("text-2xs text-foreground uppercase", {
	variants: {
		variant: {
			default: "",
			paperDate: "",
			paperPublisher: "uppercase text-wrap text-center whitespace-normal",
			paperCoAuthor:
				"text-2xs mx-auto text-foreground uppercase text-wrap text-center whitespace-normal",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const cardContentVariants = cva("", {
	variants: {
		variant: {
			default: "",
			paper: "p-4",
			paperAsk: "p-4 flex place-items-center",
		},
	},
});

const cardFooterVariants = cva("flex items-center p-6 pt-0", {
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const cardBulletVariants = cva("", {
	variants: {
		variant: {
			default: "",
			numbered:
				"rounded-full w-[17px] h-[17px] border border-foreground text-2xs pt-px items-center text-center",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

// define CardProps interface
export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(cardVariants({ variant, className }))}
			{...props}
		/>
	),
);
Card.displayName = "Card";

export interface CardHeaderProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardHeaderVariants> {
	asChild?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(cardHeaderVariants({ variant, className }))}
			{...props}
		/>
	),
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof cardTitleVariants> {
	asChild?: boolean;
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
	({ className, variant, ...props }, ref) => (
		<h3
			ref={ref}
			className={cn(cardTitleVariants({ variant, className }))}
			{...props}
		/>
	),
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement>,
		VariantProps<typeof cardDescriptionVariants> {
	asChild?: boolean;
}

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	CardDescriptionProps
>(({ className, variant, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(cardDescriptionVariants({ variant, className }))}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

export interface CardContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardContentVariants> {
	asChild?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(cardContentVariants({ variant, className }))}
			{...props}
		/>
	),
);
CardContent.displayName = "CardContent";

export interface CardFooterProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardFooterVariants> {
	asChild?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(cardFooterVariants({ variant, className }))}
			{...props}
		/>
	),
);
CardFooter.displayName = "CardFooter";

export interface CardBulletProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardBulletVariants> {
	asChild?: boolean;
}

const CardBullet = React.forwardRef<HTMLDivElement, CardBulletProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(cardBulletVariants({ variant, className }))}
			{...props}
		/>
	),
);
CardBullet.displayName = "CardBullet";

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
	CardBullet,
};
