"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
// import { toast } from "@proemial/shadcn-ui";

// Simple toast function
function toast(message: string, options?: any) {
	console.log(`Toast: ${message}`, options);
}

export function ActionBar({
	url,
	background,
	foreground,
	textColor = "#ffffff",
}: {
	url: string;
	background: string;
	foreground: string;
	textColor?: string;
	fromFeed?: boolean;
	date?: string;
}) {
	const handleShare = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		navigator.clipboard.writeText(
			`${window.location.origin.replace("app.", "news.")}/news/${encodeURIComponent(url as string)}`,
		);
		toast("Link copied", {
			style: {
				backgroundColor: background,
				color: foreground,
			},
		});
	};

	return (
		<div className="flex w-full justify-between p-3">
			<div className="flex items-center gap-4">
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
								Find Answers in Research
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
