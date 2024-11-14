import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";

export function BotForm({
	handleSubmitWithInputCheck,
	handleInputChange,
	input,
	url,
}: {
	handleSubmitWithInputCheck: (e: React.FormEvent<HTMLFormElement>) => void;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	input: string;
	url: string;
}) {
	return (
		<div className="items-center gap-1.5 px-3 py-0 flex w-full">
			<form onSubmit={handleSubmitWithInputCheck} className="flex w-full">
				<div className="w-full bg-white h-10 px-3 rounded-xl mt-0.5 text-[15px] flex gap-2 items-center border border-gray-400">
					<Trackable
						trackingKey={
							analyticsKeys.experiments.news.item.qa.clickAskInputField
						}
						properties={{ sourceUrl: url }}
					>
						<input
							id="bot-input"
							placeholder="Ask your own question..."
							value={input}
							onChange={handleInputChange}
							className="w-full h-full bg-transparent outline-none placeholder:text-[#999999]"
						/>
					</Trackable>
				</div>
			</form>
		</div>
	);
}
