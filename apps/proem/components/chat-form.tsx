"use client";
import { useVisualViewport } from "@/utils/useVisualViewport";
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

export function ChatForm({ placeholder, onSend }: ChatFormProps) {
	const { keyboardUp } = useVisualViewport();
	const [isFocused, setIsFocused] = useState(false);
	const router = useRouter();

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

	const handleBlur = () => {
		// Necessary delay to fire the form when the button is clicked and goes invisible
		setTimeout(() => setIsFocused(false), 100);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.code === "Enter") {
			setIsFocused(false);
			askQuestion(form.getValues("question"));
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
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				onSubmit={form.handleSubmit(handleSubmit)}
				className={`${
					keyboardUp
						? "bg-primary p-0 mb-[-24px] ml-[-24px] w-[calc(100%+48px)]"
						: "w-full"
				} flex gap-2 items-center`}
			>
				<FormField
					control={form.control}
					name="question"
					render={({ field }) => (
						<FormItem
							className={`${
								keyboardUp
									? "rounded-none"
									: "rounded-3xl border border-background"
							} w-full overflow-hidden`}
						>
							<FormControl>
								<Textarea
									{...field}
									placeholder={placeholder}
									className="w-full h-10 pl-4"
									onKeyDown={handleKeyDown}
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
					className={`${
						isFocused ? "visible" : "hidden"
					} rounded-full text-foreground bg-background p-2 size-6 mr-4`}
					size="icon"
					type="submit"
				>
					<ChevronRight />
				</Button>
			</form>
		</Form>
	);
}
