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
	const [url, setUrl] = useState("");

	const dismiss = () => {
		setCookie("splash", "false", { maxAge: 31536000 });
		setIsOpen(false);
	};

	return (
		<>
			{isOpen && (
				<div className="flex flex-col gap-8 items-center py-8 px-3 bg-gradient-to-b from-[#7DFA86] from-[-10%] via-[#5950EC21] via-[10%] to-transparent to-[10%] rounded-t-2xl animate-slide-down">
					<div className="w-5/6 text-xl font-semibold leading-7 text-center text-white">
						We take any news article and enrich it with scientific insights from
						the latest research papers.
					</div>

					<div className="flex gap-2 justify-center items-center w-4/5">
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
								<input
									type="url"
									name="url"
									placeholder="Enter url"
									pattern="https?://.*"
									title="Please enter a valid URL starting with http:// or https://"
									className="font-normal text-white/50 text-sm leading-[14px] bg-transparent border-none outline-none w-full"
									onChange={(e) => setUrl(e.target.value)} // Add this line
									value={url} // Add this line
								/>
								<Trackable
									trackingKey={analyticsKeys.experiments.news.clickGenerate}
								>
									<button type="submit" disabled={!url.match(/^https?:\/\/.+/)}>
										<PlusCircle className="text-[#f6f5e8] hsize-6 block hover:animate-[spin_1s_ease-in-out] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
									</button>
								</Trackable>
							</div>
							{isApp && (
								<div className="text-center italic text-xs mt-[-12px] text-gray-500">
									Pro tip: you can share with proem from your browser.
								</div>
							)}
							<div className="error-message text-sm text-red-500" />
						</form>
					</div>
				</div>
			)}
		</>
	);
}
