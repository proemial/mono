import { backgroundColor } from "@proemial/adapters/redis/news";
import React from "react";
import { ActionBar } from "./components/actionbar";
import logo from "./components/images/logo.svg";
import Image from "next/image";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

const users = [
	{ name: "Jolly Jaguar", avatar: "🐆", backgroundColor: "#000000" },
	{ name: "Bouncy Beaver", avatar: "🦫", backgroundColor: "#FFDAB9" },
	{ name: "Sneaky Squirrel", avatar: "🐿️", backgroundColor: "#87CEEB" },
	{ name: "Dazzling Dolphin", avatar: "🐬", backgroundColor: "#FF4500" },
	{ name: "Witty Walrus", avatar: "🦭", backgroundColor: "#FFFFFF" },
	{ name: "Zany Zebra", avatar: "🦓", backgroundColor: "#1E90FF" },
	{ name: "Mighty Moose", avatar: "🦌", backgroundColor: "#FFD700" },
	{ name: "Curious Cheetah", avatar: "🐆", backgroundColor: "#000000" },
	{ name: "Nifty Newt", avatar: "🦎", backgroundColor: "#FF4500" },
	{ name: "Giggly Giraffe", avatar: "🦒", backgroundColor: "#00008B" },
	{ name: "Charming Chimp", avatar: "🐒", backgroundColor: "#4682B4" },
	{ name: "Eager Eagle", avatar: "🦅", backgroundColor: "#D3D3D3" },
	{ name: "Brave Bear", avatar: "🐻", backgroundColor: "#FFE4E1" },
	{ name: "Happy Hedgehog", avatar: "🦔", backgroundColor: "#87CEFA" },
	{ name: "Speedy Sloth", avatar: "🦥", backgroundColor: "#FAFAD2" },
	{ name: "Gentle Gazelle", avatar: "🦌", backgroundColor: "#00008B" },
	{ name: "Silly Seahorse", avatar: "🐡", backgroundColor: "#FFA07A" },
	{ name: "Bold Bison", avatar: "🦬", backgroundColor: "#FFFACD" },
	{ name: "Fancy Flamingo", avatar: "🦩", backgroundColor: "#8A2BE2" },
	{ name: "Lively Llama", avatar: "🦙", backgroundColor: "#2F4F4F" },
	{ name: "Cool Crocodile", avatar: "🐊", backgroundColor: "#FFD700" },
	{ name: "Wise Wolf", avatar: "🐺", backgroundColor: "#87CEEB" },
	{ name: "Peppy Penguin", avatar: "🐧", backgroundColor: "#FFFFE0" },
	{ name: "Rambunctious Raccoon", avatar: "🦝", backgroundColor: "#ADD8E6" },
	{ name: "Playful Panda", avatar: "🐼", backgroundColor: "#ADD8E6" },
	{ name: "Tiny Turtle", avatar: "🐢", backgroundColor: "#FF69B4" },
	{ name: "Swift Sparrow", avatar: "🐦", backgroundColor: "#8B4513" },
	{ name: "Gentle Giant", avatar: "🐘", backgroundColor: "#2F4F4F" },
	{ name: "Jumping Jackal", avatar: "🦊", backgroundColor: "#00CED1" },
	{ name: "Marvelous Manta", avatar: "🐋", backgroundColor: "#FFFF00" },
	{ name: "Quiet Quokka", avatar: "🦘", backgroundColor: "#2E8B57" },
	{ name: "Vivid Viper", avatar: "🐍", backgroundColor: "#FFD700" },
	{ name: "Radiant Rabbit", avatar: "🐰", backgroundColor: "#FF1493" },
	{ name: "Sly Skunk", avatar: "🦨", backgroundColor: "#FF4500" },
	{ name: "Spritely Salmon", avatar: "🐟", backgroundColor: "#B22222" },
	{ name: "Sparkly Starling", avatar: "🐦", backgroundColor: "#A0522D" },
	{ name: "Feisty Fox", avatar: "🦊", backgroundColor: "#00CED1" },
	{ name: "Cheery Chicken", avatar: "🐔", backgroundColor: "#00CED1" },
	{ name: "Keen Koala", avatar: "🐨", backgroundColor: "#4B0082" },
	{ name: "Sunny Swan", avatar: "🦢", backgroundColor: "#8B0000" },
	{ name: "Whimsical Whale", avatar: "🐋", backgroundColor: "#FFD700" },
	{ name: "Proud Peacock", avatar: "🦚", backgroundColor: "#D2691E" },
	{ name: "Loyal Lion", avatar: "🦁", backgroundColor: "#4682B4" },
	{ name: "Eager Emu", avatar: "🦆", backgroundColor: "#FFE4B5" },
	{ name: "Friendly Ferret", avatar: "🦡", backgroundColor: "#F0E68C" },
	{ name: "Joyful Jellyfish", avatar: "🐙", backgroundColor: "#00CED1" },
	{ name: "Bright Bat", avatar: "🦇", backgroundColor: "#FFFFE0" },
	{ name: "Merry Meerkat", avatar: "🦒", backgroundColor: "#4B0082" },
	{ name: "Noble Narwhal", avatar: "🐳", backgroundColor: "#FFD700" },
	{ name: "Chirpy Chipmunk", avatar: "🐿️", backgroundColor: "#FFB6C1" },
	{ name: "Gallant Goose", avatar: "🦆", backgroundColor: "#FFD700" },
];

export function NewsCard({
	data,
	url,
}: { data: NewsAnnotatorSteps; url: string }) {
	const background = backgroundColor(data.init?.background);

	return (
		<div className="inline-flex relative">
			<div
				className="rounded-[20px] overflow-hidden text-white"
				style={{ background }}
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
					{data?.scrape?.title}
				</div>

				<ActionBar
					url={url}
					textColor="white"
					background={background}
					published
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
	const randomIndex = Math.floor(Math.random() * 3);
	const randomUser = getRandomUser(url) + randomIndex;

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
							{data.summarise?.questions.at(randomIndex)?.[0]}
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
									data.summarise?.questions.at(randomUser % 3)?.[1],
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
