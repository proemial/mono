"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { VariantProps } from "class-variance-authority";
import * as React from "react";

const messageVariants = cva("flex flex-col place-items-end md:max-w-prose", {
	variants: {
		variant: {
			question: "w-fit",
			answer: "w-4/5",
		},
	},
});

const messageContentVariants = cva("flex items-center text-base pl-4");

const messageBubbleVariants = cva("bg-card rounded-2xl px-4 pt-2 pb-3");

const messageActionVariants = cva("flex flex-col items-center text-2xs pl-3");

const messageFooterVariants = cva(
	"flex w-full text-2xs uppercase place-content-between pr-9",
);

const messageAuthorVariants = cva("flex gap-2 items-center");

const messageRepliesVariants = cva("flex items-center gap-5");

export interface MessageProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof messageVariants> {
	asChild?: boolean;
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(messageVariants({ variant, className }))}
			{...props}
		/>
	),
);
Message.displayName = "Message";

export interface MessageContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof messageVariants> {
	asChild?: boolean;
}

const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
	({ className, variant, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(messageContentVariants({ className }))}
			{...props}
		/>
	),
);
MessageContent.displayName = "MessageContent";

export interface MessageBubbleProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof messageVariants> {
	asChild?: boolean;
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(messageBubbleVariants({ className }))}
			{...props}
		/>
	),
);
MessageBubble.displayName = "MessageBubble";

export interface MessageActionProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof messageVariants> {
	asChild?: boolean;
}

const MessageAction = React.forwardRef<HTMLDivElement, MessageActionProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(messageActionVariants({ className }))}
			{...props}
		/>
	),
);
MessageAction.displayName = "MessageAction";

export interface MessageFooterProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof messageFooterVariants> {
	asChild?: boolean;
}

const MessageFooter = React.forwardRef<HTMLDivElement, MessageFooterProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(messageFooterVariants({ className }))}
			{...props}
		/>
	),
);
MessageFooter.displayName = "MessageFooter";

export interface MessageAuthorProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof messageAuthorVariants> {
	asChild?: boolean;
}

const MessageAuthor = React.forwardRef<HTMLDivElement, MessageAuthorProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(messageAuthorVariants({ className }))}
			{...props}
		/>
	),
);
MessageAuthor.displayName = "MessageAuthor";

export interface MessageRepliesProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof messageRepliesVariants> {
	asChild?: boolean;
}

const MessageReplies = React.forwardRef<HTMLDivElement, MessageRepliesProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(messageRepliesVariants({ className }))}
			{...props}
		/>
	),
);
MessageReplies.displayName = "MessageReplies";

export {
	Message,
	MessageContent,
	MessageBubble,
	MessageAction,
	MessageFooter,
	MessageAuthor,
	MessageReplies,
};
