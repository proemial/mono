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

type Props = {
	sorted: NewsAnnotatorSteps[];
	error?: string;
	debug?: boolean;
};

export function NewsFeed({ sorted, error, debug }: Props) {
	const router = useRouter();
	const iframe = useRef<HTMLIFrameElement>(null);
	const overlay = useRef<HTMLDivElement>(null);

	const [loading, setLoading] = useState(false);
	useEffect(() => {
		// Clear loading state on back in mobile browsers
		setLoading(false);
	}, []);

	const [overlayVisible, setOverlayVisible] = useState(false);
	useScrollToggle(overlayVisible);

	const handleNavigate = (encodedUrl: string) => {
		if (typeof window !== "undefined" && window.innerWidth < 1024) {
			setLoading(true);
			setOverlayVisible(false);
			router.push(`/news/${encodedUrl}`);
		} else {
			if (iframe.current) {
				setOverlayVisible(true);
				iframe.current.src = `/news/${encodedUrl}`;
			}
		}
	};

	const handleSubmit = (targetUrl?: string) => {
		if (targetUrl && iframe.current) {
			handleNavigate(encodeURIComponent(targetUrl));
		}
	};
	const handleClick = (targetUrl?: string) => {
		if (targetUrl) {
			handleNavigate(`${encodeURIComponent(targetUrl)}?p=1`);
		}
	};

	const handleClose = () => {
		if (iframe.current) {
			setOverlayVisible(false);
			iframe.current.src = "about:blank";
		}
	};

	return (
		<>
			{loading && (
				<div className="fixed inset-0 bg-black/30 z-10 flex items-center justify-center text-white/90 animate-[fadeIn_1s_ease-in]">
					<div className="border-white/50 border-t-transparent w-8 h-8 rounded-full border-4 animate-spin" />
				</div>
			)}
			<div className="ppNewsFeed flex relative flex-col items-start self-stretch w-full">
				{error && <ErrorModal error={error} />}
				<Header />
				<AnnotateForm onSubmit={handleSubmit} />
				<div className="columns-[300px] gap-[30px] w-full lg:px-8">
					{sorted.map((item, i) => (
						<Trackable
							key={i}
							trackingKey={analyticsKeys.experiments.news.feed.clickCard}
							properties={{ sourceUrl: item.init?.url as string }}
						>
							<div
								className="break-inside-avoid-page inline-flex mb-8 w-full cursor-pointer"
								data-url={item.init?.url}
								onClick={() => handleClick(`${item.init?.url}`)}
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
					className={cn("fixed inset-0 z-50", overlayVisible ? "":"hidden")}
				>
					<div className="bg-black/65 absolute inset-0" onClick={handleClose} />
					<div className="rounded-[32px] absolute left-1/2 top-[40px] -translate-x-1/2 h-[90%] w-[500px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.75)] border-white border-[12px]">
						<iframe
							ref={iframe}
							title="News content"
							className="w-full h-full border-0 rounded-[24px]"
							src="about:blank"
						/>
					</div>
				</div>
			</div>
		</>
	);
}

function useScrollToggle(disabled: boolean) {
	useEffect(() => {
		if (typeof document !== "undefined") {
			// enable/disable scrolling
			document.body.style.overflow = disabled ? "hidden" : "auto";
		}
	}, [disabled]);
}
