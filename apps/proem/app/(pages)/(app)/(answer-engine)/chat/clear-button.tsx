import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { ClearIcon } from "@/app/components/icons/menu/clear-icon";
import { Message } from "ai";

type Props = {
	isLoading: boolean;
	messages: Message[];
	stop: () => void;
	clear: () => void;
};

export function ClearButton(props: Props) {
	const { isLoading, messages, clear, stop } = props;
	const visible = !isLoading && messages.length > 0;
	const trackAndInvoke = (key: string, callback: () => void) => {
		Tracker.track(key);
		callback();
	};

	return (
		<>
			<div
				onClick={() =>
					trackAndInvoke(analyticsKeys.ask.click.stop, () => {
						stop();
						clear();
					})
				}
				className={`${
					// TODO: Fix fade in/out
					isLoading ? "opacity-100" : "opacity-0 hidden"
				} transition-all ease-in delay-300 duration-500 cursor-pointer`}
			>
				<ClearIcon />
			</div>

			<div
				onClick={() =>
					trackAndInvoke(analyticsKeys.ask.click.clear, () => clear())
				}
				className={`${
					// TODO: Fix fade in/out
					visible ? "opacity-100" : "opacity-0 hidden"
				} transition-all ease-in delay-300 duration-500 cursor-pointer`}
			>
				<ClearIcon />
			</div>
		</>
	);
}
