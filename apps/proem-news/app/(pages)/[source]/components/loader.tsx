import { Throbber } from "@/components/throbber";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import logo from "../../components/images/logo.svg";

export function AnnotationLoader({
	isScraperLoading,
	isQueryLoading,
	isPapersLoading,
	isSummariseLoading,
	data,
}: {
	isScraperLoading: boolean;
	isQueryLoading: boolean;
	isPapersLoading: boolean;
	isSummariseLoading: boolean;
	data?: NewsAnnotatorSteps;
}) {
	return (
		<div className="bg-black/80 flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm">
			<div className="p-8 mx-4 w-full max-w-lg bg-white rounded-lg shadow-lg">
				<div className="flex flex-col space-y-4">
					{isScraperLoading && (
						<ScheduledLoaderMessage>
							{data?.init?.host ? (
								<div className="flex gap-1">
									<span className="text-muted-foreground">
										Fetching content from
									</span>
									<span className="font-semibold">{data.init.host}</span>
								</div>
							) : (
								<div className="text-muted-foreground">Fetching content</div>
							)}
						</ScheduledLoaderMessage>
					)}
					{isQueryLoading && (
						<ScheduledLoaderMessage>Analyzing content</ScheduledLoaderMessage>
					)}
					{isPapersLoading && (
						<ScheduledLoaderMessage>
							Looking up relevant research
						</ScheduledLoaderMessage>
					)}
					{isSummariseLoading && (
						<ScheduledLoaderMessage
							fallback={
								<div className="flex gap-3 items-center">
									<div className="flex justify-center items-center w-8 h-8 bg-black rounded-full animate-bounce">
										<Image className="w-4 h-4" alt="Frame" src={logo} />
									</div>
									<div>Waving our magic wand</div>
								</div>
							}
						>
							Creating your page
						</ScheduledLoaderMessage>
					)}
				</div>
			</div>
		</div>
	);
}

const ScheduledLoaderMessage = ({
	children,
	fallback,
}: {
	children: ReactNode;
	/** Show if loading for more than 5 seconds. */
	fallback?: ReactNode;
}) => {
	const [showFallback, setShowFallback] = useState(false);

	useEffect(() => {
		const timeout = fallback
			? setTimeout(() => {
					setShowFallback(true);
				}, 5000)
			: undefined;
		return () => clearTimeout(timeout);
	}, [fallback]);

	return (
		<div className="flex gap-4 items-center p-5 select-none">
			{showFallback ? (
				fallback
			) : (
				<>
					<Throbber className="w-8 h-8" />
					{children}
				</>
			)}
		</div>
	);
};
