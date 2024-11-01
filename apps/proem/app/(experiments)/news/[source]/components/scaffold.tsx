"use client";
import { backgroundColor } from "@proemial/adapters/redis/news";
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

export function Scaffold({
	url,
	data: preloadedData,
}: {
	url: string;
	data?: NewsAnnotatorSteps;
}) {
	const { data: scraperData, isLoading: isScraperLoading } = useScraper(
		url,
		!!preloadedData,
	);
	const { data: queryData, isLoading: isQueryLoading } = useQueryBuilder(
		url,
		!!scraperData?.scrape?.transcript,
		!!scraperData?.summarise?.commentary,
	);
	const { data: papersData, isLoading: isPapersLoading } = usePapers(
		url,
		!!queryData?.query?.value,
		!!scraperData?.summarise?.commentary,
	);
	const { data: summariseData, isLoading: isSummariseLoading } =
		useSummarisation(
			url,
			!!papersData?.papers?.value,
			!!scraperData?.summarise?.commentary,
		);

	const data = {
		...preloadedData,
		...scraperData,
		...queryData,
		...papersData,
		...summariseData,
	};
	const isLoading =
		isScraperLoading || isQueryLoading || isPapersLoading || isSummariseLoading;

	const background = backgroundColor(data?.init?.background);

	return (
		<div className="flex flex-col items-center relative bg-white">
			{isLoading && (
				<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg">
						{isScraperLoading && (
							<ScraperLoader>
								{data?.init?.host ? (
									<div className="flex gap-1">
										<span className="opacity-75">Fetching content from</span>
										<span className="font-semibold">{data.init.host}</span>
									</div>
								) : (
									<div className="opacity-75">Fetching content</div>
								)}
							</ScraperLoader>
						)}
						{isQueryLoading && <ScraperLoader>Analyzing content</ScraperLoader>}
						{isPapersLoading && (
							<ScraperLoader>Looking up relevant research</ScraperLoader>
						)}
						{isSummariseLoading && (
							<ScraperLoader
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
							</ScraperLoader>
						)}
					</div>
				</div>
			)}

			<Header />
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto] text-[#08080a]">
					<div
						className={
							"fle≥x flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]"
						}
						style={{ background }}
					>
						<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
							<Legend
								title={data?.scrape?.title}
								image={data?.scrape?.artworkUrl}
								url={url}
								host={data?.init?.host}
							/>
						</div>
					</div>

					<ActionBar url={url} textColor="#303030" background={background} />
				</div>

				{data?.summarise?.commentary && (
					<Background text={data?.summarise?.commentary} url={url} />
				)}

				{data?.summarise?.questions && (
					<Bot questions={data?.summarise?.questions} url={url} />
				)}

				{data?.papers?.value && (
					<References papers={data?.papers?.value} url={url} />
				)}

				<Footer />
			</div>
		</div>
	);
}

const ScraperLoader = ({
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
