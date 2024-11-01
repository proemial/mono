"use client";
import { backgroundColor } from "@proemial/adapters/redis/news";
import { ActionBar } from "../../components/actionbar";
import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
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
					<div className="bg-white p-6 rounded-lg shadow-lg">
						{isScraperLoading && <div>Fetching content ...</div>}
						{isQueryLoading && <div>Analysing content ...</div>}
						{isPapersLoading && <div>Looking up relevant research ...</div>}
						{isSummariseLoading && <div>Waving the magic wand ... 🧙‍♂️</div>}
					</div>
				</div>
			)}

			<Header />
			<div className="flex flex-col gap-5">
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
