"use client";
import {
	backgroundColor,
	foregroundColor,
} from "@proemial/adapters/redis/news";
import { ActionBar } from "../../components/actionbar";
import {
	usePapers,
	useQueryBuilder,
	useScraper,
	useSummarisation,
} from "../queries";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";
import { Background } from "./background";
import { Bot } from "./bot/bot";
import { Legend } from "./legend";
import { References } from "./references/references";
import { Throbber } from "@/components/throbber";
import { ReactNode, useEffect, useState } from "react";
import logo from "../../components/images/logo.svg";
import Image from "next/image";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { extractHostName } from "@/utils/url";

export function Scaffold({
	url,
	data: preloadedData,
}: {
	url: string;
	data?: NewsAnnotatorSteps;
}) {
	const [data, setData] = useState(preloadedData);

	const {
		data: scraperData,
		isLoading: isScraperLoading,
		error: scraperError,
	} = useScraper(url, { done: !!data?.scrape?.transcript?.length });

	useEffect(() => {
		if (scraperData) setData(scraperData);
	}, [scraperData]);

	const {
		data: queryData,
		isLoading: isQueryLoading,
		error: queryError,
	} = useQueryBuilder(url, {
		preReqs: !!data?.scrape?.transcript?.length,
		done: !!data?.query?.value?.length,
	});
	useEffect(() => {
		if (queryData) setData(queryData);
	}, [queryData]);

	const {
		data: papersData,
		isLoading: isPapersLoading,
		error: papersError,
	} = usePapers(url, {
		preReqs: !!data?.query?.value?.length,
		done: !!data?.papers?.value?.length,
	});
	useEffect(() => {
		if (papersData) setData(papersData);
	}, [papersData]);

	const {
		data: summariseData,
		isLoading: isSummariseLoading,
		error: summariseError,
	} = useSummarisation(url, {
		preReqs: !!data?.papers?.value?.length,
		done: !!data?.summarise?.commentary?.length,
	});
	useEffect(() => {
		if (summariseData) setData(summariseData);
	}, [summariseData]);

	console.log(
		"scraper data",
		!!data,
		" (",
		!!scraperData,
		!!queryData,
		!!papersData,
		!!summariseData,
		")",
	);

	const isLoading =
		isScraperLoading || isQueryLoading || isPapersLoading || isSummariseLoading;

	const fatalError = queryError ?? papersError ?? summariseError ?? undefined;

	const background = backgroundColor(data?.init?.background);
	const color = foregroundColor(data?.init?.foreground);

	return (
		<div className="relative self-stretch w-full bg-white mx-auto max-w-[550px]">
			{isLoading && (
				<AnnotationLoader
					isScraperLoading={isScraperLoading}
					isQueryLoading={isQueryLoading}
					isPapersLoading={isPapersLoading}
					isSummariseLoading={isSummariseLoading}
					data={data}
				/>
			)}

			{scraperError && <ScraperError />}
			{fatalError && <AnnotationError error={fatalError} />}

			<div className="hidden max-[475px]:block min-[477px]:block">
				<Header />
			</div>
			<div className="flex flex-col gap-4 p-2 min-[475px]:p-0 min-[477px]:p-2">
				<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] text-[#08080a]">
					<div
						className={
							"flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto] p-3 rounded-[20px] border border-black/25"
						}
						style={{ background, color }}
					>
						<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto rounded-[8px]">
							<Legend
								title={data?.summarise?.engTitle ?? data?.scrape?.title}
								image={data?.scrape?.artworkUrl}
								url={url}
								summary={data?.query?.value ?? ""} // Add nullish coalescing operator
							/>
						</div>
					</div>

					{/* <ActionBar
						url={url}
						textColor="#303030"
						background={background}
						foreground={color}
						date={data?.scrape?.date}
					/> */}
				</div>

				{data?.summarise?.commentary && (
					<Background text={data?.summarise?.commentary} url={url} />
				)}

				{data?.summarise?.questions && (
					<Bot questions={data?.summarise?.questions} url={url} />
				)}

				{/* {data?.papers?.value && (
					<References papers={data?.papers?.value} url={url} />
				)} */}
			</div>
			<Footer />
		</div>
	);
}

function ScraperError() {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
			<div className="w-full max-w-lg mx-4 p-8 bg-white rounded-lg shadow-lg">
				<div className="flex flex-col space-y-4">
					<div className="space-y-2">
						<h2 className="text-xl font-bold tracking-tight">
							We can't access this article 🔎
						</h2>
						<p className="text-muted-foreground">
							We had trouble reading the article you want annotated. This could
							be because it's not an article, there's a paywall, or the website
							is not very welcoming to our robots.
						</p>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							className="flex items-center rounded-md text-sm font-medium h-9 px-4 disabled:opacity-80"
							onClick={(e) => {
								(e.target as HTMLButtonElement).disabled = true;
								window.location.href = "/news";
							}}
						>
							Dismiss
						</button>
						<button
							type="button"
							className="flex items-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 disabled:opacity-80"
							onClick={(e) => {
								(e.target as HTMLButtonElement).disabled = true;
								window.location.reload();
							}}
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function AnnotationError({ error }: { error: Error }) {
	console.error("error", error);

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 font-mono">
			<div className="bg-black/90 border border-green-500/30 rounded-lg shadow-lg p-8 max-w-lg w-full mx-4">
				<div className="flex justify-between mb-6">
					<div className="text-green-500 text-sm overflow-hidden" />
					<button
						type="button"
						onClick={() => {
							window.location.href = "/news";
						}}
						className="text-green-500 hover:text-green-400 cursor-pointer"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				<div className="mb-6 text-center space-y-3">
					<div className="text-green-500 text-xl font-bold tracking-wider animate-pulse">
						SYSTEM OVERLOAD
					</div>
					<div className="text-green-400/80">
						Connection throttled due to high traffic volume
					</div>
					<div className="text-green-400/60 text-sm">
						reboot sequence initiated...
					</div>
				</div>

				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="bg-black border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500/10 transition-colors flex items-center gap-2 animate-pulse"
					>
						<svg
							className="w-4 h-4 animate-spin"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						FORCE REBOOT
					</button>
				</div>
			</div>
		</div>
	);
}

function AnnotationLoader({
	isScraperLoading,
	isQueryLoading,
	isPapersLoading,
	isSummariseLoading,
	data,
}: {
	isScraperLoading: boolean;
	isQueryLoading: boolean;
	isPapersLoading: boolean;
	isSummariseLoading: boolean;
	data?: NewsAnnotatorSteps;
}) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
			<div className="w-full max-w-lg mx-4 p-8 bg-white rounded-lg shadow-lg">
				<div className="flex flex-col space-y-4">
					{isScraperLoading && (
						<ScheduledLoaderMessage>
							{data?.init?.host ? (
								<div className="flex gap-1">
									<span className="text-muted-foreground">
										Fetching content from
									</span>
									<span className="font-semibold">{data.init.host}</span>
								</div>
							) : (
								<div className="text-muted-foreground">Fetching content</div>
							)}
						</ScheduledLoaderMessage>
					)}
					{isQueryLoading && (
						<ScheduledLoaderMessage>Analyzing content</ScheduledLoaderMessage>
					)}
					{isPapersLoading && (
						<ScheduledLoaderMessage>
							Looking up relevant research
						</ScheduledLoaderMessage>
					)}
					{isSummariseLoading && (
						<ScheduledLoaderMessage
							fallback={
								<div className="flex gap-3 items-center">
									<div className="w-8 h-8 rounded-full bg-black flex items-center justify-center animate-bounce">
										<Image className="w-4 h-4" alt="Frame" src={logo} />
									</div>
									<div>Waving our magic wand</div>
								</div>
							}
						>
							Creating your page
						</ScheduledLoaderMessage>
					)}
				</div>
			</div>
		</div>
	);
}

const ScheduledLoaderMessage = ({
	children,
	fallback,
}: {
	children: ReactNode;
	/** Show if loading for more than 5 seconds. */
	fallback?: ReactNode;
}) => {
	const [showFallback, setShowFallback] = useState(false);

	useEffect(() => {
		const timeout = fallback
			? setTimeout(() => {
					setShowFallback(true);
				}, 5000)
			: undefined;
		return () => clearTimeout(timeout);
	}, [fallback]);

	return (
		<div className="flex gap-4 items-center p-5 select-none">
			{showFallback ? (
				fallback
			) : (
				<>
					<Throbber className="h-8 w-8" />
					{children}
				</>
			)}
		</div>
	);
};
