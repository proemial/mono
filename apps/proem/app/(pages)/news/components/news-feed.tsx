"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { NewsCard } from "../news-card";
import { ErrorModal } from "./error-modal";
import { Header } from "./header";
import { AnnotateForm } from "./annotate-form";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";

export function NewsFeed({
	sorted,
	error,
	debug,
}: { sorted: NewsAnnotatorSteps[]; error?: string; debug?: boolean }) {
	return (
		<>
			<div className="ppNewsFeed flex relative flex-col items-start self-stretch w-full">
				{error && <ErrorModal error={error} />}
				<Header />
				<AnnotateForm />
				<div className="columns-[300px] gap-[30px] w-full lg:px-8">
					{sorted.map((item, i) => (
						<Trackable
							key={i}
							trackingKey={analyticsKeys.experiments.news.feed.clickCard}
							properties={{ sourceUrl: item.init?.url as string }}
						>
							<div
								className="inline-block w-full mb-8 break-inside-avoid-page cursor-pointer"
								data-url={item.init?.url}
								onClick={(e) => {
									const target = e.currentTarget;
									const url = `/news/${encodeURIComponent(target.getAttribute("data-url") as string)}?p=1`;
									const overlay = document.querySelector("[data-overlay]");
									const iframe = document.querySelector(
										"[data-iframe]",
									) as HTMLIFrameElement;
									if (window.innerWidth < 1024) {
										if (overlay) overlay.classList.add("hidden");
										window.location.href = url;
									} else if (overlay && iframe && url) {
										overlay.classList.remove("hidden");
										iframe.src = url;
										document.body.style.overflow = "hidden"; // Disable scrolling
									}
								}}
							>
								<NewsCard
									url={item.init?.url as string}
									data={item}
									debug={debug}
								/>
							</div>
						</Trackable>
					))}
				</div>

				{/* Overlay and iframe - hidden by default */}
				<div data-overlay className="hidden fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/65"
						onClick={() => {
							const overlay = document.querySelector("[data-overlay]");
							const iframe = document.querySelector(
								"[data-iframe]",
							) as HTMLIFrameElement;
							if (overlay && iframe) {
								overlay.classList.add("hidden");
								iframe.src = "about:blank";
								document.body.style.overflow = "auto"; // Re-enable scrolling
							}
						}}
					/>
					<div className="rounded-[12px] absolute left-1/2 top-[40px] -translate-x-1/2 h-[90%] w-[500px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.75)] border-white border-8">
						<iframe
							data-iframe
							title="News content"
							className="w-full h-full border-0"
							src="about:blank"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
