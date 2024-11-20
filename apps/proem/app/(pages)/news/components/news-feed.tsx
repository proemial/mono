"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { NewsCard } from "./news-card";
import { ErrorModal } from "./error-modal";
import { Header } from "./header";
import { AnnotateForm } from "./annotate-form";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";
import { useEffect, useRef, useState } from "react";
import { cn } from "@proemial/shadcn-ui/lib/utils";
import { useRouter } from "next/navigation";

function useScrollToggle(disabled: boolean) {
	useEffect(() => {
		if (typeof document !== "undefined") {
			document.body.style.overflow = disabled ? "hidden" : "auto"; // enable/disable scrolling
		}
	}, [disabled]);
}

export function NewsFeed({
	sorted,
	error,
	debug,
}: { sorted: NewsAnnotatorSteps[]; error?: string; debug?: boolean }) {
	const router = useRouter();
	const iframe = useRef<HTMLIFrameElement>(null);
	const overlay = useRef<HTMLDivElement>(null);

	const [overlayVisible, setOverlayVisible] = useState(false);
	useScrollToggle(overlayVisible);

	const handleClick = (targetUrl?: string) => {
		if (targetUrl && iframe.current) {
			const url = `/news/${encodeURIComponent(targetUrl)}?p=1`;

			if (window.innerWidth < 1024) {
				setOverlayVisible(false);
				router.push(url);
			} else {
				setOverlayVisible(true);
				iframe.current.src = url;
			}
		}
	};

	const handleClose = () => {
		if (iframe.current) {
			setOverlayVisible(false);
			iframe.current.src = "about:blank";
		}
	};

	return (
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
							className="inline-flex w-full mb-8 break-inside-avoid-page cursor-pointer"
							data-url={item.init?.url}
							onClick={() => handleClick(item.init?.url)}
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

			<div
				ref={overlay}
				className={cn("fixed inset-0 z-50", overlayVisible ? "" : "hidden")}
			>
				<div className="absolute inset-0 bg-black/65" onClick={handleClose} />
				<div className="rounded-[32px] absolute left-1/2 top-[40px] -translate-x-1/2 h-[90%] w-[500px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.75)] border-white border-[12px]">
					<iframe
						ref={iframe}
						title="News content"
						className="w-full h-full border-0"
						src="about:blank"
					/>
				</div>
			</div>
		</div>
	);
}
