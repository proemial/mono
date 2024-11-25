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
		<div className="items-center gap-1.5 py-0 flex w-full">
			<form onSubmit={handleSubmitWithInputCheck} className="flex w-full">
				<div className="w-full bg-white px-3 rounded-xl mt-0.5 text-[15px] flex gap-2 items-center border border-gray-400">
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
							className="w-full h-full py-3 bg-transparent outline-none placeholder:text-[#999999]"
						/>
						<button type="submit" className="hover:opacity-70">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M10.5 8.19202H2.7659C2.6529 7.93402 0.388897 2.81402 0.388897 2.81402C-0.371106 1.09402 1.4469 -0.627979 3.1229 0.22302L16.9039 7.21702C18.3639 7.95702 18.3639 10.043 16.9039 10.783L3.1239 17.777C1.4469 18.628 -0.371106 16.905 0.388897 15.186L2.7639 9.808H10.5" fill="#666"/>
							</svg>
						</button>
					</Trackable>
				</div>
			</form>
		</div>
	);
}
