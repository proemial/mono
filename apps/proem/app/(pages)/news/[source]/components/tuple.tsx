import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { Icons } from "@proemial/shadcn-ui";
import Image from "next/image";
import logo from "../../components/images/logo.svg";
import { Avatar } from "../../components/avatars";
import { Paper } from "./references/paper";
import { useEffect, useRef } from "react";
import { useIsApp } from "@/utils/app";

type Props = {
	question: string;
	children?: React.ReactNode;
	user?: User;
	papers?: IndexedReferencedPaper[];
	throbber?: boolean;
	scrollTo?: boolean;
	prefix?: string;
	activeColors?: { foreground?: string; background?: string };
};

export function QaTuple({
	question,
	children,
	user,
	papers,
	throbber,
	scrollTo,
	prefix,
	activeColors,
}: Props) {
	const isApp = useIsApp();
	const qaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window !== "undefined" && scrollTo && qaRef.current) {
			const yOffset = isApp ? -82 : -64;
			const y =
				qaRef.current.getBoundingClientRect().top +
				window.pageYOffset +
				yOffset;
			window.scrollTo({ top: y, behavior: "smooth" });
		}
	}, [scrollTo, isApp]);

	return (
		<div ref={qaRef} className="flex flex-col">
			<div className=" bg-gradient-to-b to-[#e9ecec] from-[#e1e7ea] rounded-xl mb-0 mt-4">
				<div className="flex flex-col flex-1">
					<div className="flex flex-col gap-2 p-3 w-full">
						{user && (
							<div className="flex items-start w-full">
								{user?.avatar ? (
									<div className="w-6 h-6 rounded-sm text-2xl flex items-center justify-center bg-[#0A161C]">
										<span className="text-[11px]">{user?.avatar ?? "*"}</span>
									</div>
								) : (
									<Avatar seed="6" />
								)}

								<div className="text-[#606567] text-sm leading-[14px] h-6 flex items-center ml-2 mb-1">
									{user?.name} asked
								</div>
							</div>
						)}

						<div className="flex content-between items-center font-medium text-[#08080a] text-[19px] leading-6">
							<div className="flex-1">{question}</div>
							{throbber && (
								<Icons.loader className="fill-theme-800/70 mr-2 w-4 h-4" />
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<div className="flex gap-2">
						<div className="flex overflow-hidden flex-col flex-1 gap-1 w-full">
							<div className="flex flex-col gap-1 px-3 pb-3 w-full">
								<>
									<div className="font-medium text-[#131316] text-[16px] leading-6">
										{children}
									</div>
									<div className="flex items-start mt-2 mb-6 w-full">
										<div className="w-6 h-6 rounded-sm text-2xl flex items-center justify-center bg-[#0A161C]">
											<Image className="w-3 h-3" alt="Frame" src={logo} />
										</div>
										<div className="text-[#606567] font-normal text-sm leading-[14px] h-6 flex items-center ml-2 w-full gap-1">
											<div className="flex-1">Explained by Proem</div>

											<a
												href="/"
												onClick={(e) => e.preventDefault()}
												className="inline-flex items-center px-2 py-1 rounded-full border border-[#99a1a3] text-[#606567] hover:text-white hover:bg-[#99a1a3] transition-colors"
												title="Learn how our Science bot works"
											>
												<svg
													className="mr-1 w-3 h-3"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
												</svg>
												<div className="text-[11px]">Like</div>
											</a>
											<a
												href="/"
												onClick={(e) => e.preventDefault()}
												className="inline-flex items-center px-2 py-1 rounded-full border border-[#99a1a3] text-[#606567] hover:text-white hover:bg-[#99a1a3] transition-colors"
												title="Share this answer"
											>
												<svg
													className="mr-1 w-3 h-3"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
													<polyline points="16 6 12 2 8 6" />
													<line x1="12" y1="2" x2="12" y2="15" />
												</svg>
												<div className="text-[11px]">Share</div>
											</a>
										</div>
									</div>

									{papers && (
										<div className="flex overflow-x-auto gap-2 justify-start duration-500 animate-fade-in pt-[1px]">
											{papers?.map((paper, index) => (
												<Trackable
													key={index}
													trackingKey={
														analyticsKeys.experiments.news.item.sources
															.clickPaperSource
													}
													properties={{
														// sourceUrl: url,
														paperId: paper.id,
													}}
												>
													<Paper
														paper={paper}
														index={paper.index ?? index}
														prefix={prefix}
														activeColors={activeColors}
													/>
												</Trackable>
											))}
										</div>
									)}
								</>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export type User = {
	name: string;
	avatar?: string;
	backgroundColor?: string;
};

export type IndexedReferencedPaper = ReferencedPaper & { index: number };

export function indexPapers(
	papers: ReferencedPaper[],
	callback: (paper: IndexedReferencedPaper) => boolean,
) {
	return papers.map((paper, index) => ({ ...paper, index })).filter(callback);
}
