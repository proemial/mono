"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { SelectContentSelector } from "@/components/select-content-selector";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Icons,
	Input,
	Paragraph,
} from "@proemial/shadcn-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BottomDrawer } from "./bottom-drawer";

const DEFAULT_MODEL = { "gpt-4-turbo": "GPT-4 Turbo" };
const DEFAULT_MODEL_ID = Object.keys(DEFAULT_MODEL)[0] as keyof typeof MODELS;

const MODELS = {
	...DEFAULT_MODEL,
	"claude-3-opus": "Claude 3 Opus",
	"gemini-1.5-pro": "Gemini 1.5 Pro",
	"mistral-large": "Mistral Large",
	"mixtral-8x22b": "Mixtral 8x22B",
	"llama-3": "Llama 3",
} as const;

const formSchema = z.object({
	email: z.string().email().max(50),
});

export type ModelSelectorProps = {
	trackingKeys: typeof analyticsKeys.ask | typeof analyticsKeys.read;
	className?: string;
};

export const ModelSelector = ({
	className,
	trackingKeys,
}: ModelSelectorProps) => {
	const [selectedValue, setSelectedValue] = useState(DEFAULT_MODEL_ID);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [subscribeResponse, setSubscribeResponse] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const url =
			"https://script.google.com/macros/s/AKfycbwY0a6mYqNvcOxtgseR2mzLswCdZcmJCx-3cGbepbZjDu4X2aSXp43VFZYegMKeDRuh/exec";
		try {
			setSubscribeResponse("loading");
			trackHandler(trackingKeys.submit.modelEmail);
			const result = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "text/plain" },
				redirect: "follow",
				body: JSON.stringify({
					email: values.email,
					model: MODELS[selectedValue],
				}),
			});
			if (result.status === 200) {
				setSubscribeResponse("success");
			} else {
				setSubscribeResponse("error");
			}
		} catch (error) {
			setSubscribeResponse("error");
		}
	}

	const handleValueChange = (value: string) => {
		setSelectedValue(value as keyof typeof MODELS);
		setDrawerOpen(true);
	};

	const handleDrawerClose = () => {
		setDrawerOpen(false);
		setSelectedValue(DEFAULT_MODEL_ID);
		setSubscribeResponse("idle");
		form.reset();
	};

	return (
		<BottomDrawer
			open={drawerOpen}
			trigger={
				<SelectContentSelector
					className={className}
					selector={Object.entries(MODELS).map(([value, label]) => ({
						value,
						label,
					}))}
					staticValue={DEFAULT_MODEL_ID}
					onValueChange={handleValueChange}
					trackingKey={trackingKeys.click.model}
				/>
			}
			onDrawerClose={handleDrawerClose}
		>
			<div className="space-y-5 pb-10">
				<div className="text-2xl leading-normal">Coming soon…</div>
				<Paragraph>
					We're working on adding support for new models like{" "}
					{MODELS[selectedValue]}. Be the first to know when it's ready!
				</Paragraph>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex gap-2 items-start"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="grow">
									<FormControl>
										<Input
											placeholder="Email address…"
											className="grow bg-white"
											disabled={["loading", "success"].includes(
												subscribeResponse,
											)}
											onClick={trackHandler(
												trackingKeys.click.modelEmailInputField,
											)}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="text-xs tracking-wider"
							disabled={["loading", "success"].includes(subscribeResponse)}
						>
							Subscribe
						</Button>
					</form>
				</Form>
				{subscribeResponse === "loading" && (
					<div className="flex flex-col justify-center items-center gap-4">
						<Icons.loader />
					</div>
				)}
				{subscribeResponse === "success" && (
					<div className="flex flex-col justify-center items-center gap-4">
						<div>Alright! You'll hear back from us soon!</div>
						<Button
							onClick={handleDrawerClose}
							className="text-xs tracking-wider"
						>
							Close
						</Button>
					</div>
				)}
			</div>
		</BottomDrawer>
	);
};
