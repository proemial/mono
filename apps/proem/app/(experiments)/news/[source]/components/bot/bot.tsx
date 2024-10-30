import { NewsItem } from "@proemial/adapters/redis/news";
import { BotQa } from "./bot-qa";
import { BotSuggestion } from "./bot-suggestion";

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

export function Bot({ data }: { data?: NewsItem }) {
	return (
		<>
			<div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
				{data?.generated?.questions.slice(0, 3).map((qa, index) => (
					<BotQa key={index} user={users.at(index)} qa={qa} />
				))}
			</div>

			<div className="flex-col items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative">
				<div className="items-center gap-1.5 px-3 py-0 flex relative self-stretch w-full flex-[0_0_auto]">
					<div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
						<img
							className="relative w-10 h-10 object-cover w-8 h-8 rounded-full"
							alt=""
							src="https://randomuser.me/api/portraits/med/men/4.jpg"
						/>
					</div>

					<div className="flex-col h-10 gap-1 px-3 py-2 flex-1 grow bg-white border border-solid border-[#728087] flex items-center justify-center relative rounded-xl">
						<div className="relative self-stretch font-normal text-[#738187] text-[15px] tracking-[0] leading-5">
							Ask as Michael Lajlev
						</div>
					</div>
				</div>

				<div className="flex-col items-start gap-2 pl-[58px] pr-3 py-0 self-stretch w-full flex-[0_0_auto] flex relative">
					{data?.generated?.questions.slice(3).map((qa, index) => (
						<BotSuggestion key={index} qa={qa} />
					))}
				</div>
			</div>
		</>
	);
}
