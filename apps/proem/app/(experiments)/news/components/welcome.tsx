"use client";
import { PlusCircle } from "@untitled-ui/icons-react";
import { getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import { isBlockedUrl } from "../blocked";
import { useIsApp } from "@/utils/app";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

export function Welcome() {
	const isApp = useIsApp();
	const [isOpen, setIsOpen] = useState(
		typeof document !== "undefined" ? !getCookie("splash") : false,
	);

	const dismiss = () => {
		setCookie("splash", "false", { maxAge: 31536000 });
		setIsOpen(false);
	};

	return (
		<>
			{isOpen && (
				<div className="flex flex-col items-center justify-end space-y-8 py-8 pt-32 px-3 bg-gradient-to-b from-[#7DFA86] from-[0%] via-[#5950EC21] via-[28%] to-transparent to-[60%] animate-slide-down">
					<div className="flex flex-col items-center justify-center gap-2 w-4/5">
						<p className="font-semibold text-white text-xl text-center leading-7">
							We take any news article and enrich it with scientific insights
							from the latest research papers.
						</p>
					</div>

					<div className="flex w-4/5 h-[52px] items-center justify-center gap-2">
						<form
							onSubmit={(e) => {
								console.log("submit");

								e.preventDefault();
								const form = e.target as HTMLFormElement;
								const url = form.url.value;
								const isBlockedError = isBlockedUrl(url);

								// Check if it's a Facebook URL
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
								dismiss();
								window.location.href = `/news/${encodeURIComponent(url)}`;
							}}
							className="flex flex-col gap-4"
						>
							<div className="flex w-80 items-center gap-2.5 p-4 rounded-full border border-white/80">
								<Trackable trackingKey={analyticsKeys.experiments.news.clickGenerate}>
								<button type="submit">
									<PlusCircle className="text-[#f6f5e8] hsize-6 block hover:animate-[spin_1s_ease-in-out] cursor-pointer" />
								</button>
								</Trackable>
								<input
									type="url"
									name="url"
									placeholder="Enter url"
									pattern="https?://.*"
									title="Please enter a valid URL starting with http:// or https://"
									className="font-normal text-white/50 text-sm leading-[14px] bg-transparent border-none outline-none w-full"
								/>
							</div>
							{isApp && (
								<div className="text-center italic text-xs mt-[-12px] text-gray-500">
									Pro tip: you can share with proem from your browser.
								</div>
							)}
							<div className="text-red-500 text-sm error-message" />
						</form>
					</div>

					<div className="inline-flex items-center gap-1.5">
						<div
							className="font-semibold text-white/60 text-sm text-center leading-[14px] underline hover:pointer"
							onClick={dismiss}
						>
							(X)
						</div>
					</div>
				</div>
			)}
		</>
	);
}
