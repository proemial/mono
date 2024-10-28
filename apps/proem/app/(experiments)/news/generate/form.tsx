"use client";

import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Throbber } from "@/components/throbber";
import { Trackable } from "@/components/trackable";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@proemial/shadcn-ui";
import { MagicWand02 } from "@untitled-ui/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PrimaryItemSchema } from "./types";

type Props = {
	onSubmit: (data: z.infer<typeof PrimaryItemSchema>) => Promise<void>;
};

export const InputForm = ({ onSubmit }: Props) => {
	const form = useForm<z.infer<typeof PrimaryItemSchema>>({
		resolver: zodResolver(PrimaryItemSchema),
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (data: z.infer<typeof PrimaryItemSchema>) => {
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
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>URL</FormLabel>
							<FormControl>
								<Input
									className="rounded-md bg-white"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormDescription className="text-theme-700">
								Enter the URL of the content you want to annotate.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-center">
					<Trackable
						trackingKey={analyticsKeys.experiments.news.clickGenerate}
						properties={{
							type: form.getValues().type,
							url: form.getValues().url,
						}}
					>
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
					</Trackable>
				</div>
			</form>
		</Form>
	);
};
