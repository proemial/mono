"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { NewsCard } from "../news-card";
import { ErrorModal } from "./error-modal";
import { Header } from "./header";
import { Welcome } from "./welcome";
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
				<Welcome />
				{/*  @brian: Connect to our email list provider */}
				{/*  @brian: Show after 6 cards */}
				{/*  @brian: Don't show if already signed up */}
				{/* <SubscribeForm /> */}
				<div className="columns-[300px] gap-5">
					{sorted.map((item, i) => (
						<Trackable
							key={i}
							trackingKey={analyticsKeys.experiments.news.feed.clickCard}
							properties={{ sourceUrl: item.init?.url as string }}
						>
							<div
								className="active:opacity-80 block mb-5 break-inside-avoid cursor-pointer"
								data-url={item.init?.url}
								onClick={(e) => {
									const target = e.currentTarget;
									const url = `/news/${encodeURIComponent(target.getAttribute("data-url") as string)}?p=1`;
									const overlay = document.querySelector("[data-overlay]");
									const iframe = document.querySelector(
										"[data-iframe]",
									) as HTMLIFrameElement;
									if (overlay && iframe && url) {
										overlay.classList.remove("hidden");
										iframe.src = url;
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
						className="absolute inset-0 bg-black/50"
						onClick={() => {
							const overlay = document.querySelector("[data-overlay]");
							const iframe = document.querySelector(
								"[data-iframe]",
							) as HTMLIFrameElement;
							if (overlay && iframe) {
								overlay.classList.add("hidden");
								iframe.src = "about:blank";
							}
						}}
					/>
					<div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[500px] bg-white">
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
