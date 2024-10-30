"use client";
import { Header } from "../../components/header";
import { Legend } from "./legend";
import { NewsItem } from "@proemial/adapters/redis/news";
import { ActionBar } from "../../components/actionbar";
import { Background } from "./background";
import { Bot } from "./bot/bot";
import { References } from "./references/references";
import { Footer } from "../../components/footer";

export function Scaffold({ data }: { data: NewsItem }) {
	const background = data._?.background ?? "#000000";

	return (
		<div className="flex flex-col items-center gap-5 relative bg-white">
			<img
				className="absolute w-8 h-8 top-[95px] left-[27px] object-cover"
				alt=""
				src={data.source?.image}
			/>

			<div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto] text-[#08080a]">
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

				<ActionBar textColor="#303030" />
			</div>

			<Background data={data} />

			<Bot data={data} />

			<References data={data} />

			<Footer />
		</div>
	);
}
