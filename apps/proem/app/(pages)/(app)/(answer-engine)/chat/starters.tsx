import { STARTERS } from "@/app/(pages)/(app)/(answer-engine)/starters";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { Tracker } from "@/app/components/analytics/tracker";
import { ProemLogo } from "@/app/components/icons/brand/logo";
import { Button } from "@/app/components/proem-ui/link-button";
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
		<div className="flex flex-col h-full mb-3" suppressHydrationWarning>
			<div className="flex flex-col items-center justify-center h-full px-8 text-center">
				<Text />
			</div>
			<div className="flex flex-wrap gap-[6px]">
				{starters.map((starter) => (
					<Button
						key={starter.index}
						variant="starter"
						className="w-full mb-1 cursor-pointer"
						onClick={() => {
							trackAndInvoke(() =>
								append({ role: "user", content: starter.text }),
							);
						}}
					>
						{starter.text}
					</Button>
				))}
			</div>
		</div>
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
