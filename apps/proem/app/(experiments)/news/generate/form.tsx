"use client";

import { Throbber } from "@/components/throbber";
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
import { MagicWand02 } from "@untitled-ui/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "./types";

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
									className="min-h-[300px] rounded-md text-base"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-center">
					<Button
						type="submit"
						disabled={isLoading}
						className="hover:bg-theme-500 active:bg-theme-600 min-w-[150px]"
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
				</div>
			</form>
		</Form>
	);
};
