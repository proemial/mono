"use client";
import { analyticsKeys, trackHandler } from "@/app/components/analytics/tracking/tracking-keys";
import { useDeviceType, useVisualViewport } from "@/utils/useVisualViewport";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Textarea,
} from "@proemial/shadcn-ui";
import { ChevronRight } from "@untitled-ui/icons-react";
import { useChat } from "ai/react";
import { cva } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const QuerySchema = z.object({
	question: z.string(),
});

export type ChatFormProps = {
	placeholder: string;
	onSend?: ReturnType<typeof useChat>["append"];
	onFocusChange?: (isFocused: boolean) => void;
};

export function ChatForm({
	placeholder,
	onSend,
	onFocusChange,
}: ChatFormProps) {
	const router = useRouter();

	const [isFocused, setIsFocused] = useState(false);
	const { isMobile } = useDeviceType();
	const simulateKeyboardUp = isFocused && isMobile;

	const form = useForm<z.infer<typeof QuerySchema>>({
		resolver: zodResolver(QuerySchema),
	});

	const { keyboardUp } = useVisualViewport();
	useEffect(() => {
		if (!keyboardUp && !isFocused) {
			setIsFocused(false);
		}
	}, [keyboardUp, isFocused]);

	useEffect(() => {
		!!onFocusChange && onFocusChange(isFocused);
	}, [isFocused, onFocusChange]);

	const askQuestion = (question: string) => {
		trackHandler(analyticsKeys.ask.submit.ask)();
		if (onSend) {
			onSend({ role: "user", content: question });
		} else {
			router.push(`/answer/${encodeURIComponent(question)}`);
		}
	};

	const handleSubmit = (data: z.infer<typeof QuerySchema>) => {
		setTimeout(() => askQuestion(data.question));
	};

	const handleFocus = () => {
		setIsFocused(true);
		trackHandler(analyticsKeys.ask.click.input)();
	};

	const handleBlur = () => {
		// Necessary delay to fire the form when the button is clicked and goes invisible
		setTimeout(() => setIsFocused(false), 100);
	};

	const handleFormInput = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		const target = e.target as HTMLTextAreaElement;
		if (
			(e.code === "Enter" || target.value.includes("\n")) &&
			target.value?.replaceAll("\n", "")?.length
		) {
			setIsFocused(false);
			!!onFocusChange && onFocusChange(false);
			askQuestion(form.getValues("question"));
			form.setValue("question", "");
			return false;
		}
	};

	const handleChange = (textarea: HTMLTextAreaElement) => {
		const initialHeight = 48;
		const expandAt = 72;

		// reset the height to get the correct scrollHeight
		textarea.style.height = "inherit";
		textarea.style.height =
			textarea.scrollHeight > expandAt
				? `${textarea.scrollHeight}px`
				: `${initialHeight}px`;
	};

	return (
		<Form {...form}>
			<form
				onFocus={handleFocus}
				onBlur={handleBlur}
				onSubmit={form.handleSubmit(handleSubmit)}
				className={style("form", isFocused, simulateKeyboardUp)}
			>
				<div className={style("background", isFocused, simulateKeyboardUp)}>
					<FormField
						control={form.control}
						name="question"
						render={({ field }) => (
							<FormItem
								className={style("inputWrapper", isFocused, simulateKeyboardUp)}
							>
								<FormControl>
									<Textarea
										{...field}
										placeholder={placeholder}
										className={`dark:placeholder:text-[#e5e5e5] placeholder:text-[#2b2b2b] placeholder:opacity-40 ${style(
											"input",
											isFocused,
											simulateKeyboardUp,
										)} ${form.getFieldState("question").invalid
											? "border border-red-300"
											: ""
											}`}
										onKeyDown={(e) => {
											const target = e.target as HTMLTextAreaElement;
											if (e.code === "Enter" || target.value.includes("\n")) {
												e.preventDefault();
											}
											return handleFormInput(e);
										}}
										onInput={handleFormInput}
										onChange={(e) => {
											handleChange(e.target as HTMLTextAreaElement);
											field.onChange(e);
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Button
						disabled={
							!!(
								form.formState.isSubmitting ||
								form.getFieldState("question").error ||
								!form.getValues("question")?.length
							)
						}
						className={style("button", isFocused, simulateKeyboardUp)}
						size="icon"
						type="submit"
						onClick={trackHandler(analyticsKeys.ask.click.submit)}
					>
						<ChevronRight />
					</Button>
				</div>
			</form>
		</Form>
	);
}

const formStyles = {
	form: cva("w-full"),
	background: cva(
		"w-full flex items-center bg-primary border border-background mt-3",
		{
			variants: {
				variant: {
					default: "mb-12 rounded-3xl",
					focusKeyboardDown: "mb-6 rounded-3xl",
					focusKeyboardUp: "w-screen rounded-none mb-0 ml-[-16px]",
				},
			},
		},
	),

	inputWrapper: cva("w-full"), // annoying shadcn/ui div
	input: cva("w-full h-12 pl-6 resize-none flex items-center text-lg", {
		variants: {
			variant: {
				default: "rounded-3xl",
				focusKeyboardDown: "rounded-l-3xl",
				focusKeyboardUp: "rounded-none",
			},
		},
	}),

	button: cva(
		"rounded-full text-foreground border border-[1px] bg-card p-2 size-8 mr-4",
		{
			variants: {
				variant: {
					default: "hidden",
					focusKeyboardDown: "visible",
					focusKeyboardUp: "visible",
				},
			},
		},
	),
};

function style(
	item: keyof typeof formStyles,
	isFocused: boolean,
	keyboardUp: boolean,
) {
	return formStyles[item]({
		variant: keyboardUp
			? "focusKeyboardUp"
			: isFocused
				? "focusKeyboardDown"
				: "default",
	});
}
