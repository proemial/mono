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
			<div className="flex-col pb-2 items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative">
				<div className="items-center gap-1.5 px-3 py-0 flex relative self-stretch w-full flex-[0_0_auto]">
					<div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
						<img
							className="relative object-cover w-8 h-8 rounded-full"
							alt=""
							src="https://randomuser.me/api/portraits/med/men/4.jpg"
						/>
					</div>

					<div className="flex-col h-10 gap-1 px-3 py-2 flex-1 grow border border-solid bg-[#E9EAEE] flex items-center justify-center relative rounded-xl">
						<div className="relative self-stretch font-normal text-[#738187] text-[15px] tracking-[0] leading-5">
							Ask a Question
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1.5 relative pl-[62px]">
					<p className="relative w-fit mt-[-1.00px] font-medium text-[#757989] text-xs tracking-[0] leading-5 whitespace-nowrap">
						Suggested questions
					</p>
				</div>

				<div className="flex-col items-start gap-2 pl-[50px] pr-3 py-0 self-stretch w-full flex-[0_0_auto] flex relative">
					{data?.generated?.questions.slice(3).map((qa, index) => (
						<BotSuggestion key={index} qa={qa} />
					))}
				</div>
			</div>
			<div className="flex items-center justify-end gap-2 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<div className="items-center gap-2 flex-1 grow flex relative">
					<div className="relative w-fit mt-[-1.00px] font-semibold text-[#0a161c] text-lg tracking-[0] leading-4 whitespace-nowrap">
						Top questions
					</div>
				</div>
			</div>
			<div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
				{data?.generated?.questions.slice(0, 3).map((qa, index) => (
					<BotQa key={index} user={users.at(index)} qa={qa} />
				))}
			</div>
		</>
	);
}
