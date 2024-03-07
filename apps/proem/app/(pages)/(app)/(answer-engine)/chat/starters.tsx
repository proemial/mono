import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { ProemLogo } from "@/app/components/icons/brand/logo";
import { StarterButton } from "@/app/components/proem-ui/link-button";
import { memo, useEffect, useState } from "react";

export const Starters = memo(function Starters({ append }: { append: any }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	const starters = [...STARTERS]
		.map((text, index) => ({ index, text }))
		.sort(() => 0.5 - Math.random())
		.slice(0, 3);

	const trackAndInvoke = (callback: () => void) => {
		Tracker.track(analyticsKeys.ask.click.starter);
		callback();
	};

	return (
		<>
			{starters.map((starter) => (
				<StarterButton
					key={starter.index}
					variant="starter"
					className="w-full cursor-pointer"
					onClick={() => {
						trackAndInvoke(() =>
							append({ role: "user", content: starter.text }),
						);
					}}
				>
					{starter.text}
				</StarterButton>
			))}
		</>
	);
});

function Text() {
	return (
		<>
			<ProemLogo includeName />
			<div className="pt-6 text-md text-white/80">
				<div>answers to your questions</div>
				<div>supported by scientific research</div>
			</div>
		</>
	);
}
