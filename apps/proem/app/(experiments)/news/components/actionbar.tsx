"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { backgroundColor as bgColor } from "@proemial/adapters/redis/news";
import { toast } from "@proemial/shadcn-ui";

export function ActionBar({
	url,
	background,
	textColor = "#ffffff",
}: { url: string; background: string; textColor?: string }) {
	const getRandomViews = (title: string) => {
		// Create a consistent hash from the title
		let hash = 0;
		for (let i = 0; i < title.length; i++) {
			hash = (hash << 5) - hash + title.charCodeAt(i);
			hash = hash & hash; // Convert to 32-bit integer
		}
		// Generate base random-looking but consistent number between 50 and 500
		const baseViews = Math.abs(hash % 300) + 50;

		// Get minutes since this method was first written
		const now = new Date();
		const baseTime = new Date(1730416261598);
		baseTime.setHours(0, 0, 0, 0);
		const minutesSinceBaseTime = Math.floor(
			(now.getTime() - baseTime.getTime()) / (1000 * 60),
		);

		// Add 1 view for every 10 minutes since the base timestamp
		const additionalViews = Math.floor(minutesSinceBaseTime / 10);

		return baseViews + additionalViews;
	};

	// For now using a placeholder title since we don't have access to it
	const viewCount = getRandomViews(url);

	const handleShare = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		navigator.clipboard.writeText(
			`${window.location.origin}/news/${encodeURIComponent(url as string)}`,
		);
		toast("Link copied", {
			style: {
				backgroundColor: background,
			},
		});
	};

	return (
		<div className="flex w-full justify-between px-3">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-5 relative flex-1 grow">
					<Trackable
						trackingKey={analyticsKeys.experiments.news.item.clickViewCounter}
						properties={{ sourceUrl: url }}
					>
						<div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z"
									stroke={textColor}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
									stroke={textColor}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<div className="relative w-fit font-normal text-[13px] tracking-[0] leading-[normal]">
								{viewCount}
							</div>
						</div>
					</Trackable>
				</div>
				<Trackable
					trackingKey={analyticsKeys.experiments.news.item.clickAskScience}
					properties={{ sourceUrl: url }}
				>
					<div
						className="inline-flex h-8 items-center gap-1 px-3 py-2 relative flex-[0_0_auto] rounded-[19px] border border-solid active:bg-theme-600"
						onClick={() =>
							document
								.getElementById("askform")
								?.scrollIntoView({ block: "center", behavior: "smooth" })
						}
						style={{ borderColor: textColor }}
					>
						<div className="inline-flex items-start gap-1.5 relative flex-[0_0_auto] hover:cursor-pointer">
							<div className="relative w-fit mt-[-1.00px] font-normal text-[13px] tracking-[0] leading-[normal]">
								Ask science
							</div>
						</div>
					</div>
				</Trackable>
			</div>

			<div
				onClick={handleShare}
				className="inline-flex h-8 items-center gap-1 px-3 py-2 relative flex-[0_0_auto] rounded-[19px] border border-solid hover:cursor-pointer active:bg-theme-600"
				style={{ borderColor: textColor }}
			>
				<div className="inline-flex items-start gap-1.5 relative flex-[0_0_auto]">
					<svg
						width="15"
						height="14"
						viewBox="0 0 15 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M13.6867 7.43321C13.8608 7.28394 13.9478 7.20934 13.9798 7.12054C14.0077 7.04266 14.0077 6.95737 13.9798 6.87949C13.9478 6.79069 13.8608 6.71602 13.6867 6.56682L7.64542 1.38859C7.34574 1.1317 7.1959 1.00325 7.06902 1.00011C6.95876 0.997378 6.85342 1.04582 6.78375 1.13132C6.70358 1.22969 6.70358 1.42705 6.70358 1.82179V4.88513C5.18115 5.15147 3.78776 5.92288 2.75229 7.08125C1.62339 8.34403 0.998924 9.97823 0.998047 11.6721V12.1085C1.74643 11.2071 2.68083 10.4779 3.73725 9.9711C4.66863 9.52429 5.67546 9.25962 6.70358 9.18987V12.1782C6.70358 12.573 6.70358 12.7703 6.78375 12.8687C6.85342 12.9542 6.95876 13.0027 7.06902 12.9999C7.1959 12.9967 7.34574 12.8683 7.64542 12.6114L13.6867 7.43321Z"
							stroke={textColor}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<Trackable
						trackingKey={analyticsKeys.experiments.news.item.clickShare}
						properties={{ sourceUrl: url }}
					>
						<div className="relative w-fit mt-[-1.00px] font-normal text-[13px] tracking-[0] leading-[normal]">
							Share
						</div>
					</Trackable>
				</div>
			</div>
		</div>
	);
}
