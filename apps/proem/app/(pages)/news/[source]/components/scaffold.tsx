"use client";
import {
	backgroundColor,
	foregroundColor,
	NewsAnnotatorSteps,
} from "@proemial/adapters/redis/news";
import { useEffect, useState } from "react";
import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import {
	usePapers,
	useQueryBuilder,
	useScraper,
	useSummarisation,
} from "../queries";
import { Background } from "./background";
import { Bot } from "./bot/bot";
import { AnnotationError, ScraperError } from "./errors";
import { Legend } from "./legend";
import { AnnotationLoader } from "./loader";

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

	const isLoading =
		isScraperLoading || isQueryLoading || isPapersLoading || isSummariseLoading;

	const fatalError = queryError ?? papersError ?? summariseError ?? undefined;

	const background = backgroundColor(data?.init?.background);
	const foreground = foregroundColor(data?.init?.foreground);

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

			<div className="hidden max-[475px]:block min-[477px]:block sticky top-0 z-50">
				<Header />
			</div>
			<div className="flex flex-col p-2 min-[475px]:p-0 min-[477px]:p-2">
				<div className="flex flex-col items-start self-stretch w-full flex-[0_0_auto] text-[#08080a]">
					<div
						className={
							"flex-[0_0_auto] rounded-[20px] border-black/25 flex relative flex-col gap-2 items-start self-stretch p-3 w-full border"
						}
						style={
							{
								"--newsBackground": background,
								"--newsColor": foreground,
								background: "var(--newsBackground)",
								color: "var(--newsColor)",
							} as React.CSSProperties
						}
					>
						<div className="flex flex-col items-start self-stretch w-full flex-[0_0_auto] rounded-[8px]">
							<Legend
								title={data?.summarise?.engTitle ?? data?.scrape?.title}
								image={data?.scrape?.artworkUrl}
								url={url}
								summary={data?.query?.value} // Add nullish coalescing operator
							/>
						</div>
					</div>
				</div>

				{data?.summarise?.commentary && (
					<Background
						text={data?.summarise?.commentary}
						papers={data?.papers?.value}
						activeColors={{ foreground, background }}
					/>
				)}

				{data?.summarise?.questions && (
					<Bot
						starters={data?.summarise?.questions}
						url={url}
						backgroundPapers={data?.papers?.value}
						activeColors={{ foreground, background }}
					/>
				)}
			</div>
			<Footer />
		</div>
	);
}
