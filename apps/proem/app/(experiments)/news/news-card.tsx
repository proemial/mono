import { NewsItem } from "@proemial/adapters/redis/news";
import React from "react";
import { ActionBar } from "./components/actionbar";
import logo from "./components/images/logo.svg";
import Image from "next/image";

const users = [
	{
		image: "https://randomuser.me/api/portraits/med/men/1.jpg",
		name: "Michael Lajlev",
		time: "6h",
	},
	{
		image: "https://randomuser.me/api/portraits/med/men/2.jpg",
		name: "Mads Rydahl",
		time: "2d",
	},
	{
		image: "https://randomuser.me/api/portraits/med/women/1.jpg",
		name: "Lene Hansen",
		time: "1w",
	},
];

function getRandomUser() {
	return Math.floor(Math.random() * 3);
}

export function NewsCard({ data }: { data: NewsItem }) {
	const background = data._?.background ?? "#000000";

	return (
		<div className="flex flex-col items-start gap-1 relative">
			<div
				className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] rounded-[20px] overflow-hidden shadow-[0px_2px_8px_2px_#00000033] text-white"
				style={{ background }}
			>
				<img
					className="relative self-stretch w-full h-[200px] object-cover"
					alt=""
					src={data?.source?.image}
				/>

				<div className="flex flex-col items-center justify-center gap-2 p-3 relative self-stretch w-full flex-[0_0_auto] ">
					<p className="relative self-stretch mt-[-1.00px] font-semibold text-xl tracking-[0] leading-[normal]">
						{data.generated?.title}
					</p>
				</div>

				<ActionBar textColor="white" title={data.generated?.title}/>

				<QA data={data} />
			</div>
		</div>
	);
}

function QA({ data }: { data: NewsItem }) {
	const formatAnswerText = (text?: string) => {
		if (!text) return "";
		return text.replace(/^\s*-\s*/gm, '').split(/(\[.*?\])/).map((segment, i) => {
			const match = segment.match(/\[(.*?)\]/);
			if (match) {
				const numbers = match[1]?.split(",").map((n) => n.trim());
				return numbers?.map((num, j) => (
					<span className="relative inline-block" key={`${i}-${j}`} >
						<span key={`${i}-${j}`} 
							className="relative -top-[2px] inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold cursor-pointer hover:bg-gray-800">
							{num}
						</span>
					</span>
				));
			}
			return segment;
		});
	};
	
	const randomQuestion = getRandomUser();

	return (
		<div className="flex flex-col items-start gap-2 mt-4 pt-2 pb-3 px-0 relative self-stretch w-full flex-[0_0_auto]">
			<div className="flex items-start gap-1.5 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<img
					className="relative w-10 h-10 object-cover rounded-full"
					alt=""
					src="https://randomuser.me/api/portraits/med/men/4.jpg"
				/>

				<div className="flex flex-col items-start gap-1 relative flex-1 grow">
					<div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
						<div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
							<div className="relative flex-1 mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px]">
								{users[randomQuestion]?.name ?? 'Anonymous'}
							</div>
						</div>

						<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
							{data.generated?.questions.at(randomQuestion)?.[0]}
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
								{formatAnswerText(data.generated?.questions.at(randomQuestion)?.[1])}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
