"use client";
import { Header } from "../../components/header";
import { Legend } from "./legend";
import { NewsItem } from "@proemial/adapters/redis/news";
import { ActionBar } from "./actionbar";
import { Background } from "./background";
import { Bot } from "./bot/bot";
import { References } from "./references/references";

export function Scaffold({ data }: { data: NewsItem }) {
	const background = data._?.background ?? "#000000";

	return (
		<div className="flex flex-col items-center gap-5 relative bg-white">
			<img
				className="absolute w-8 h-8 top-[95px] left-[27px] object-cover"
				alt=""
				src={data.source?.image}
			/>

			<div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
				<div
					className={
						"fle≥x flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]"
					}
					style={{ background }}
				>
					<div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
						<Header />

						<Legend data={data} />
					</div>
				</div>

				<ActionBar />
			</div>

			<Background data={data} />

			<div className="flex items-center justify-end gap-2 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<div className="items-center gap-2 flex-1 grow flex relative">
					<div className="relative w-fit mt-[-1.00px] [font-family:'Lato-SemiBold',Helvetica] font-semibold text-[#08080a] text-lg tracking-[0] leading-4 whitespace-nowrap">
						Top questions
					</div>

					<img
						className="relative w-[7px]"
						alt="Frame"
						src={data.source?.image}
					/>
				</div>
			</div>

			<Bot data={data} />

			<References data={data} />

			<div className="flex flex-col items-start justify-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#0a161c] rounded-[14px_14px_0px_0px]">
				<div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#f6f5e8] text-base tracking-[0] leading-[normal] whitespace-nowrap">
					What is proem.ai
				</div>

				<p className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#f6f5e8] text-sm tracking-[0] leading-5">
					Our mission is to make science useful and inspiring for everyone.
					Proem takes any piece of online content and enriches it with science.
				</p>
			</div>
		</div>
	);
}
