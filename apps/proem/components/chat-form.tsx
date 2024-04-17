"use client";
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
import { useChat } from "ai/react";
import { ChevronRight, Stop } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useVisualViewport } from "@/utils/useVisualViewport";

export const QuerySchema = z.object({
	query: z.string(),
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

	function onSubmit(data: z.infer<typeof QuerySchema>) {
		if (onSend) {
			onSend({ role: "user", content: data.query });
		} else {
			router.push(`/answer/${encodeURIComponent(data.query)}`);
		}
	}

	function onBlur() {
		// Necessary delay to fire the form when the button is clicked and goes invisible
		setTimeout(() => setIsFocused(false), 100);
	}

	return (
		<Form {...form}>
			<form
				onFocus={() => setIsFocused(true)}
				onBlur={onBlur}
				onSubmit={form.handleSubmit(onSubmit)}
				className={`${keyboardUp ? "bg-primary p-0 mb-[-28px]" : "py-4"
					} w-full flex gap-2 items-center`}
			>
				<FormField
					control={form.control}
					name="query"
					render={({ field }) => (
						<FormItem
							className={`${isFocused ? "rounded-none md:rounded-3xl" : "rounded-3xl"
								} w-full overflow-hidden`}
						>
							<FormControl>
								<Textarea
									placeholder={placeholder}
									className="w-full h-10 pl-4 pt-[10px]"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					className={`${isFocused ? "visible" : "hidden"
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
