import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import {
	backgroundColor,
	foregroundColor,
} from "@proemial/adapters/redis/news";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { ActionBar } from "./components/actionbar";
import logo from "./components/images/logo.svg";
import { users } from "./components/users";

export function NewsCard({
	data,
	url,
	debug,
}: { data: NewsAnnotatorSteps; url: string; debug?: boolean }) {
	const background = backgroundColor(data.init?.background);
	const color = foregroundColor(data.init?.foreground);

	return (
		<div className="inline-flex relative">
			<div
				className="rounded-[20px] overflow-hidden"
				style={{ background, color }}
			>
				<div
					className="relative self-stretch w-full h-[220px] bg-cover bg-top"
					style={{ backgroundImage: `url(${data?.scrape?.artworkUrl})` }}
				/>
				<Trackable
					trackingKey={analyticsKeys.experiments.news.item.clickSource}
					properties={{ sourceUrl: url }}
				>
					<div className="inline-flex items-start px-3 py-1 absolute top-[176px] left-[12px] bg-[#ffffffe6] text-black rounded-[26px]">
						{data?.init?.host}
					</div>
				</Trackable>
				<div className="inline-flex p-3 mt-[-1.00px] leading-[normal] font-semibold text-xl flex-[0_0_auto] drop-shadow-md">
					{debug &&
						`[${data?.init?.sort ?? ""}][${
							data?.scrape?.date
								? dayjs(data?.scrape?.date).format("DD.MM.YYYY HH:mm")
								: ""
						}] `}
					{data?.scrape?.title}
				</div>

				<ActionBar
					url={url}
					textColor="white"
					background={background}
					foreground={color}
					fromFeed
					date={data?.scrape?.date}
				/>

				<QA data={data} url={url} />
			</div>
		</div>
	);
}

function QA({ data, url }: { data: NewsAnnotatorSteps; url: string }) {
	const getRandomUser = (title: string) => {
		// Create a consistent hash from the title
		let hash = 0;
		for (let i = 0; i < title.length; i++) {
			hash = (hash << 5) - hash + title.charCodeAt(i);
			hash = hash & hash; // Convert to 32-bit integer
		}
		// return random-looking but consistent user number
		return Math.abs(hash % (users.length - 3));
	};
	// For now using a placeholder title since we don't have access to it
	const randomUser = getRandomUser(url) + Math.floor(Math.random() * 3);
	const randomIndex = randomUser % 3;

	const formatAnswerText = (text?: string) => {
		if (!text) return "";
		return text
			.replace(/^\s*-\s*/gm, "")
			.split(/(\[.*?\])/)
			.map((segment, i) => {
				const match = segment.match(/\[(.*?)\]/);
				if (match) {
					const numbers = match[1]?.split(",").map((n) => n.trim());
					return numbers?.map((num, j) => (
						<span className="" key={`${i}-${j}`}>
							<span
								key={`${i}-${j}`}
								className="items-center justify-center rounded-full bg-black text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
								style={{ padding: "3px", position: "relative", top: "-2px" }}
							>
								&nbsp;{num}&nbsp;
							</span>
						</span>
					));
				}
				return segment;
			});
	};

	return (
		<div className="flex flex-col items-start gap-2 mt-2 pt-2 pb-3 px-0 relative self-stretch w-full flex-[0_0_auto]">
			<div className="flex items-start gap-1.5 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<div className="relative w-10 h-10 object-cover rounded-full text-2xl flex items-center justify-center bg-[#000000]">
					<span>{users[randomUser]?.avatar ?? "*"}</span>
				</div>
				<div className="flex flex-col items-start gap-1 relative flex-1 grow">
					<div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
						<div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
							<div className="relative w-fit mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
								{users[randomUser]?.name ?? "Anonymous"}
							</div>
							<div className="px-1.5 py-0.5 ml-0.5 mt-[-2px] relative bg-white rounded-full border border-gray-300">
								<div className="relative w-fit font-semibold text-gray-500 text-xs leading-3 whitespace-nowrap">
									Anonymous user
								</div>
							</div>
						</div>

						<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
							{data.summarise?.questions?.at(randomIndex)?.[0]}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-start gap-2 pl-[58px] pr-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
					<div className="relative flex-[0_0_auto] w-8 h-8 rounded-full bg-black flex items-center justify-center">
						<Image className="w-4 h-4" alt="Frame" src={logo} />
					</div>

					<div className="flex flex-col items-start gap-1 relative flex-1 grow">
						<div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
							<div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
								<div className="relative w-fit mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
									proem.ai
								</div>

								<div className="px-1.5 py-0.5 ml-0.5 mt-[-2px] relative bg-black rounded-full  ">
									<div className="relative w-fit font-semibold text-[#6aba6f] text-xs leading-3 whitespace-nowrap">
										Science bot
									</div>
								</div>
							</div>

							<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
								{formatAnswerText(
									data.summarise?.questions?.at(randomIndex)?.[1],
								)}
							</p>
							<div className="w-full font-medium text-[#757989] text-xs leading-5 cursor-pointer">
								Answer based on scientific papers
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
