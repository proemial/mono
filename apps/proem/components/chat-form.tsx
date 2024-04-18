"use client";
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
import { KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const QuerySchema = z.object({
	question: z.string(),
});

export type ChatFormProps = {
	placeholder: string;
	onSend?: ReturnType<typeof useChat>["append"];
};

export default function ChatForm({ placeholder, onSend }: ChatFormProps) {
	const router = useRouter();

	const [isFocused, setIsFocused] = useState(false);
	const { isMobile } = useDeviceType();

	// const { keyboardUp } = useVisualViewport();
	// Use simulated keyboardUp, to test in desktop browsers.
	const keyboardUp = false; //isFocused && isMobile;

	const form = useForm<z.infer<typeof QuerySchema>>({
		resolver: zodResolver(QuerySchema),
	});

	const askQuestion = (question: string) => {
		if (onSend) {
			onSend({ role: "user", content: question });
		} else {
			router.push(`/answer/${encodeURIComponent(question)}`);
		}
	};

	const handleSubmit = (data: z.infer<typeof QuerySchema>) => {
		askQuestion(data.question);
	};

	const handleFocus = () => {
		setIsFocused(true);
		setTimeout(
			() =>
				globalThis.scrollTo({
					top: globalThis.document.body.scrollHeight,
					behavior: "smooth",
				}),
			100,
		);
	};

	const handleBlur = () => {
		// Necessary delay to fire the form when the button is clicked and goes invisible
		setTimeout(() => setIsFocused(false), 100);
	};

	const handleFormInput = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		const target = e.target as HTMLTextAreaElement;
		if (e.code === "Enter" || target.value.includes("\n")) {
			e.preventDefault();
			setIsFocused(false);
			askQuestion(form.getValues("question"));
			return false;
		}
	};

	const handleChange = (textarea: HTMLTextAreaElement) => {
		const initialHeight = 40;

		// reset the height to get the correct scrollHeight
		textarea.style.height = "inherit";
		textarea.style.height =
			textarea.scrollHeight > 56
				? `${textarea.scrollHeight}px`
				: `${initialHeight}px`;
	};

	return (
		<Form {...form}>
			<form
				onFocus={handleFocus}
				onBlur={handleBlur}
				onSubmit={form.handleSubmit(handleSubmit)}
				className={style("form", isFocused, keyboardUp)}
			>
				<FormField
					control={form.control}
					name="question"
					render={({ field }) => (
						<FormItem className={style("wrapper", isFocused, keyboardUp)}>
							<FormControl>
								<Textarea
									{...field}
									placeholder={placeholder}
									className={style("input", isFocused, keyboardUp)}
									onKeyDown={handleFormInput}
									onInput={handleFormInput}
									onChange={(e) => {
										handleChange(e.target as HTMLTextAreaElement);
										field.onChange(e);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					className={style("button", isFocused, keyboardUp)}
					size="icon"
					type="submit"
				>
					<ChevronRight />
				</Button>
			</form>
		</Form>
	);
}

const formStyles = {
	form: cva("flex gap-2 items-center", {
		variants: {
			variant: {
				default: "w-full",
				focusKeyboardDown: "w-full",
				focusKeyboardUp:
					"bg-primary p-0 mb-[-24px] ml-[-24px] w-[calc(100%+48px)]",
			},
		},
	}),
	wrapper: cva("w-full overflow-hidden", {
		variants: {
			variant: {
				default: "rounded-3xl border border-background",
				focusKeyboardDown: "rounded-3xl border border-background",
				focusKeyboardUp: "rounded-none",
			},
		},
	}),
	input: cva("w-full h-10 pl-4"),
	button: cva("rounded-full text-foreground bg-muted p-2 size-6 mr-4", {
		variants: {
			variant: {
				default: "hidden",
				focusKeyboardDown: "hidden",
				focusKeyboardUp: "visible",
			},
		},
	}),
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
