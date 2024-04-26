"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/app/components/analytics/tracking/tracking-keys";
import { useVisualViewport } from "@/utils/useVisualViewport";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
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
	trackingPrefix: string;
};

export function ChatForm({
	placeholder,
	onSend,
	onFocusChange,
	trackingPrefix,
}: ChatFormProps) {
	const router = useRouter();

	const [isFocused, setIsFocused] = useState(false);

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
		trackHandler(`${trackingPrefix}:${analyticsKeys.chat.submit.input}`)();
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
		trackHandler(`${trackingPrefix}:${analyticsKeys.chat.click.input}`)();
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
				className="w-full"
			>
				<div className="w-full mb-12 mt-3 flex items-center bg-primary border border-background rounded-3xl">
					<FormField
						control={form.control}
						name="question"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Textarea
										{...field}
										placeholder={placeholder}
										className={`w-full h-12 pl-6 resize-none flex items-center text-lg dark:placeholder:text-[#e5e5e5] placeholder:text-[#2b2b2b] placeholder:opacity-40 ${
											isFocused ? "rounded-l-3xl" : "rounded-3xl"
										} ${
											form.getFieldState("question").invalid
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
						className="rounded-full text-foreground border-[1px] bg-card p-2 size-8 mr-2"
						size="icon"
						type="submit"
						onClick={trackHandler(
							`${trackingPrefix}:${analyticsKeys.chat.click.submit}`,
						)}
					>
						<ChevronRight />
					</Button>
				</div>
			</form>
		</Form>
	);
}
