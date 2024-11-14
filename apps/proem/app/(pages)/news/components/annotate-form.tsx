"use client";
import { PlusCircle } from "@untitled-ui/icons-react";
import { useEffect, useState } from "react";
import { isBlockedUrl } from "../blocked";
import { useIsApp } from "@/utils/app";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/components/analytics/tracking/tracker";

export function AnnotateForm() {
	const isApp = useIsApp();
	const [isOpen, setIsOpen] = useState(false);
	const [url, setUrl] = useState("");

	useEffect(() => {
		setTimeout(() => {
			setIsOpen(true);
		}, 300);
	}, []);

	return (
		<>
			{(
				<div
					className="flex flex-col items-center justify-between self-stretch p-2 mb-4 lg:mx-8 bg-gradient-to-b from-[#7DFA86] from-[-25%] via-[#3732916b] via-[75%] to-[#312d7b6b] to-[100%] rounded-2xl h-[75vh]"
				>
					<div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
						<div className="text-xl font-semibold leading-7 text-center text-white drop-shadow-md">
							Enrich news articles with insights
							<br />
							from the latest research papers.
						</div>
						<div className="flex gap-1 justify-center items-center w-full px-6">
							<form
								onSubmit={(e) => {
									console.log("submit");
									Tracker.track(analyticsKeys.experiments.news.clickGenerate);

									e.preventDefault();
									const form = e.target as HTMLFormElement;
									const url = form.url.value;
									const isBlockedError = isBlockedUrl(url);

									// Check if it's a blocked URL
									if (isBlockedError) {
										const errorDiv = form.querySelector(
											".error-message",
										) as HTMLDivElement;
										errorDiv.textContent = isBlockedError;
										return;
									}

									form.querySelectorAll("button, input").forEach((el) => {
										(el as HTMLElement).setAttribute("disabled", "true");
									});
									window.location.href = `/news/${encodeURIComponent(url)}`;
								}}
								className="flex flex-col gap-4 w-full max-w-[500px]"
							>
								<div className="flex w-full items-center gap-2.5 p-4 pl-5 rounded-full border border-white bg-black/50">
									<input
										type="url"
										name="url"
										placeholder="Paste news article URL"
										pattern="https?://.*"
										title="Please enter a valid URL starting with http:// or https://"
										className="font-normal text-white/50 text-sm leading-[14px] bg-transparent border-none outline-none w-full"
										onChange={(e) => setUrl(e.target.value)}
										value={url}
										required
									/>
									<button type="submit" disabled={!url.match(/^https?:\/\/.+/)}>
										<PlusCircle className="text-[#f6f5e8] hsize-6 block hover:animate-[spin_1s_ease-in-out] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
									</button>
								</div>
								{isApp && (
									<div className="text-center italic text-xs mt-[-12px] text-gray-500">
										Pro tip: Share to proem directly from your browser.
									</div>
								)}
								<div className="error-message text-sm text-red-500" />
							</form>
						</div>
					</div>
					<div className="w-full text-base pb-4 font-semibold leading-7 text-center text-white/60 drop-shadow-md">
						...latest articles enriched by other users:
					</div>
				</div>
			)}
		</>
	);
}
