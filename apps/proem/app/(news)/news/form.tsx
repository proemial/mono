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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "./types";
import { useState } from "react";
import { Throbber } from "@/components/throbber";
import { MagicWand02 } from "@untitled-ui/icons-react";

type Props = {
	onSubmit: (data: z.infer<typeof FormSchema>) => Promise<void>;
};

export const TextareaForm = ({ onSubmit }: Props) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
		setIsLoading(true);
		await onSubmit(data);
		setIsLoading(false);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex flex-col gap-4"
			>
				<FormField
					control={form.control}
					name="newsArticle"
					render={({ field }) => (
						<FormItem>
							<h3>News Article</h3>
							<FormControl>
								<Textarea
									className="min-h-[300px] rounded-md"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					disabled={isLoading}
					className="hover:bg-theme-500 active:bg-theme-600"
				>
					{isLoading ? (
						<Throbber />
					) : (
						<div className="flex gap-2 items-center">
							<MagicWand02 className="size-4" />
							Generate
						</div>
					)}
				</Button>
			</form>
		</Form>
	);
};
