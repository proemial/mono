import { backgroundColor } from "@proemial/adapters/redis/news";
import React from "react";
import { ActionBar } from "./components/actionbar";
import logo from "./components/images/logo.svg";
import Image from "next/image";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news2";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

const users = [
	{
		image: "https://randomuser.me/api/portraits/med/men/12.jpg",
		name: "James Anderson",
		time: "3h",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/5.jpg",
		name: "Sarah Mitchell",
		time: "5h",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/8.jpg",
		name: "Robert Wilson",
		time: "1d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/15.jpg",
		name: "Emily Parker",
		time: "2d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/3.jpg",
		name: "David Thompson",
		time: "3d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/9.jpg",
		name: "Jessica Brown",
		time: "4d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/17.jpg",
		name: "William Davis",
		time: "5d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/2.jpg",
		name: "Rachel Moore",
		time: "1w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/6.jpg",
		name: "Thomas Martin",
		time: "1w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/18.jpg",
		name: "Laura Wilson",
		time: "2w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/14.jpg",
		name: "Christopher Lee",
		time: "2w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/11.jpg",
		name: "Amanda White",
		time: "3w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/19.jpg",
		name: "Daniel Clark",
		time: "3w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/7.jpg",
		name: "Michelle Taylor",
		time: "4w",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/4.jpg",
		name: "Kevin Walker",
		time: "1m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/13.jpg",
		name: "Jennifer Adams",
		time: "1m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/10.jpg",
		name: "Brian Miller",
		time: "2m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/20.jpg",
		name: "Lisa Johnson",
		time: "2m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/1.jpg",
		name: "Mark Robinson",
		time: "3m",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/16.jpg",
		name: "Katherine Hall",
		time: "3m",
	},
];

function getRandomUser() {
	return Math.floor(Math.random() * users.length);
}

export function NewsCard({ data }: { data: NewsAnnotatorSteps }) {
	const background = backgroundColor(data.init?.background);

	return (
		<div className="flex flex-col items-start gap-1 relative">
			<div
				className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] rounded-[20px] overflow-hidden shadow-[0px_2px_8px_2px_#00000033] text-white"
				style={{ background }}
			>
				<img
					className="relative self-stretch w-full h-[220px] object-cover object-top"
					alt=""
					src={data?.scrape?.artworkUrl}
				/>

				<div className=" absolute top-[8px] right-[4px] text-white pr-4 opacity-80">
					Answers based on scientific research
				</div>

				<Trackable
					trackingKey={analyticsKeys.experiments.news.item.clickSource}
					properties={{ sourceUrl: data?.init?.url ?? "" }}
				>
					<div className="inline-flex items-start gap-1 px-3 py-1 absolute top-[176px] left-[12px] bg-[#ffffffe6] text-black rounded-[26px]">
						<a href={data?.init?.url} target="_blank" rel="noopener noreferrer">
							{data?.init?.host}
						</a>
					</div>
				</Trackable>

				<div className="flex flex-col items-center justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto] ">
					<p className="relative self-stretch mt-[-1.00px] font-semibold text-xl tracking-[0] leading-[normal]">
						{data?.scrape?.title}
					</p>
				</div>

				<ActionBar url={data?.init?.url} textColor="white" />

				<QA data={data} />
			</div>
		</div>
	);
}

function QA({ data }: { data: NewsAnnotatorSteps }) {
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
						<span className="relative inline-block" key={`${i}-${j}`}>
							<span
								key={`${i}-${j}`}
								className="relative -top-[2px] inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold cursor-pointer hover:bg-gray-800"
							>
								{num}
							</span>
						</span>
					));
				}
				return segment;
			});
	};

	const randomUser = getRandomUser();

	return (
		<div className="flex flex-col items-start gap-2 mt-4 pt-2 pb-3 px-0 relative self-stretch w-full flex-[0_0_auto]">
			<div className="flex items-start gap-1.5 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<img
					className="relative w-10 h-10 object-cover rounded-full"
					alt=""
					src={users[randomUser]?.image ?? "/news/images/profile.png"}
				/>

				<div className="flex flex-col items-start gap-1 relative flex-1 grow">
					<div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
						<div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
							<div className="relative flex-1 mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px]">
								{users[randomUser]?.name ?? "Anonymous"}
							</div>
						</div>

						<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
							{data.summarise?.questions.at(randomUser % 3)?.[0]}
						</p>
					</div>
				</div>

				{/* <img
	        className="absolute w-0.5 h-[60px] top-[269px] left-[-29391px]"
	        alt="Rectangle"
	        src={rectangle1084}
	      /> */}
			</div>

			<div className="flex flex-col items-start gap-2 pl-[58px] pr-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
					<div className="relative flex-[0_0_auto] w-8 h-8 rounded-full bg-black flex items-center justify-center">
						<Image className="w-4 h-4" alt="Frame" src={logo} />
					</div>

					<div className="flex flex-col items-start gap-1 relative flex-1 grow">
						<div className="flex flex-col items-center justify-center gap-1 p-3 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
							<div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
								<div className="relative w-fit mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
									proem.ai
								</div>

								<div className="inline-flex items-center justify-center gap-2 px-1 py-0 relative flex-[0_0_auto] bg-[#ebf5ff] rounded-xl">
									<div className="relative w-fit mt-[-1.00px] font-medium text-[#0164d0] text-[11px] tracking-[0] leading-[14px] whitespace-nowrap">
										Research bot
									</div>
								</div>
							</div>

							<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
								{formatAnswerText(
									data.summarise?.questions.at(randomUser % 3)?.[1],
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
			<Trackable
				trackingKey={analyticsKeys.experiments.news.item.clickViewAllSources}
				properties={{ sourceUrl: data?.source?.url ?? "" }}
			>
				<div className="w-full text-right text-white pr-4 opacity-50">
					<span className="underline ml-2">View all sources</span>
				</div>
			</Trackable>
		</div>
	);
}
