"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import {
	backgroundColor,
	foregroundColor,
} from "@proemial/adapters/redis/news";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import logo from "./components/images/logo.svg";
import { users } from "./components/users";
import { extractHostName } from "@/utils/url";

function ppMouseMove(
	cardRef: React.RefObject<HTMLDivElement>,
	event: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>,
) {
	if (typeof window === "undefined" || window.innerWidth <= 1024) return;

	const halfW: number = (cardRef.current?.clientWidth ?? 0) / 2;
	const halfH = (cardRef.current?.clientHeight ?? 0) / 2;
	const coorX =
		halfW - ((event as MouseEvent).pageX - (cardRef.current?.offsetLeft ?? 0));
	const coorY =
		halfH - ((event as MouseEvent).pageY - (cardRef.current?.offsetTop ?? 0));
	const degX = (coorY / halfH) * 5; // max. degree = 10
	const degY = (coorX / halfW) * -5; // max. degree = 10
	if (cardRef.current) {
		cardRef.current.style.transform = `perspective(600px) translate3d(0, -2px, 0) scale(1.1) rotateX(${degX}deg) rotateY(${degY}deg)`;
		const summary = cardRef.current.querySelector(".ppNewsCard__qa");
		if (summary instanceof HTMLElement) {
			summary.style.transform = `perspective(600px) translate3d(${degY / 2}px,${-degX / 2}px,0)`;
		}
		const image = cardRef.current.querySelector(".ppNewsCard__pic");
		if (image instanceof HTMLElement) {
			image.style.backgroundPosition = `${-degY / 2}px ${degX / 2}px`;
		}
	}
}

function ppMouseLeave(cardRef: React.RefObject<HTMLDivElement>) {
	if (typeof window === "undefined" || window.innerWidth <= 1024) return;

	if (cardRef.current) {
		cardRef.current.style.transform = "";
		const summary = cardRef.current.querySelector(".ppNewsCard__qa");
		if (summary instanceof HTMLElement) {
			summary.style.transform = "";
		}
	}
}

export function NewsCard({
	data,
	url,
	debug,
}: { data: NewsAnnotatorSteps; url: string; debug?: boolean }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const background = backgroundColor(data.init?.background);
	const color = foregroundColor(data.init?.foreground);
	const { randomUser, randomIndex } = useRandomUser(url);

	const formatAnswerText = (text?: string) => {
		if (!text) return "";
		return text
			.replace(/^\s*-\s*/gm, "")
			.split(/(\[.*?\])/)
			.map((segment, i) => {
				const match = segment.match(/\[(.*?)\]/);
				if (match) {
					const numbers = match[1]?.split(",").map((n) => n.trim());
					return numbers?.map((num, j) => (
						<span className="" key={`${i}-${j}`}>
							<span
								key={`${i}-${j}`}
								className="items-center justify-center rounded-full bg-black text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
								style={{ padding: "3px", position: "relative", top: "-2px" }}
							>
								&nbsp;{num}&nbsp;
							</span>
						</span>
					));
				}
				return segment;
			});
	};

	return (
		<>
			<OldSchoolStyling />

			<div
				ref={cardRef}
				className="ppNewsCard inline-flex relative"
				onMouseMove={(e) => ppMouseMove(cardRef, e)}
				onMouseLeave={(e) => ppMouseLeave(cardRef)}
				// onMouseEnter={(e) => ppMouseMove(cardRef, e)}
			>
				<div
					className="rounded-[20px] px-3 pt-3 overflow-hidden"
					style={{ background, color }}
				>
					<div className="ppNewsCard__gradient cover rounded-[20px]" />
					<div
						className="ppNewsCard__pic relative self-stretch w-full h-[220px] bg-cover bg-top rounded-[14px] shadow-[inset_0_0_40px_rgba(0,0,0,0.7)]"
						style={{ backgroundImage: `url(${data?.scrape?.artworkUrl})` }}
					/>
					<Trackable
						trackingKey={analyticsKeys.experiments.news.item.clickSource}
						properties={{ sourceUrl: url }}
					>
						<div className="ppNewsCard__host inline-flex items-start px-3 py-1 absolute top-[188px] left-[26px] bg-[#ffffffe6] text-black rounded-[26px]">
							{extractHostName(url)}
						</div>
					</Trackable>
					<div className="ppNewsCard__title relative flex flex-col pt-3 pb-3 mt-[-4.00px] leading-[normal] font-semibold text-xl flex-[0_0_auto] drop-shadow-md">
						{debug &&
							`[${
								data?.scrape?.date ?? data.init?.createdAt
									? dayjs(data?.scrape?.date ?? data.init?.createdAt).format(
											"DD.MM.YYYY HH:mm",
										)
									: ""
							}] `}
						{data?.scrape?.title}
					</div>

					<div className="ppNewsCard__qa flex flex-col items-start gap-2 px-0 pb-3 relative self-stretch w-full flex-[0_0_auto]">
						<div className="flex items-start gap-1.5 py-0 relative self-stretch w-full flex-[0_0_auto]">
							<div className="relative w-10 h-10 object-cover rounded-full text-2xl flex items-center justify-center bg-[#000000]">
								<span>{users[randomUser]?.avatar}</span>
							</div>
							<div className="flex flex-col items-start gap-1 relative flex-1 grow">
								<div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl shadow-[0_0px_10px_1px_rgba(0,0,0,0.2)]">
									<div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
										<div className="relative w-fit mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
											{users[randomUser]?.name ?? "Anonymous"}
										</div>
										<div className="px-1.5 py-0.5 ml-0.5 mt-[-2px] relative bg-white rounded-full border border-gray-300">
											<div className="relative w-fit font-semibold text-gray-500 text-xs leading-3 whitespace-nowrap overflow-hidden text-ellipsis">
												Anonymous user
											</div>
										</div>
									</div>

									<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
										{data.summarise?.questions?.at(randomIndex)?.[0]}
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col items-start gap-2 pl-[44px] py-0 relative self-stretch w-full flex-[0_0_auto]">
							<div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
								<div className="relative flex-[0_0_auto] w-8 h-8 rounded-full bg-black flex items-center justify-center">
									<Image className="w-4 h-4" alt="Frame" src={logo} />
								</div>

								<div className="flex flex-col items-start gap-1 relative flex-1 grow">
									<div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl shadow-[0_0px_10px_1px_rgba(0,0,0,0.2)]">
										<div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
											<div className="relative w-fit mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
												proem.ai
											</div>

											<div className="px-1.5 py-0.5 ml-0.5 mt-[-2px] relative bg-black rounded-full  ">
												<div className="relative w-fit font-semibold text-[#6aba6f] text-xs leading-3 whitespace-nowrap">
													Science bot
												</div>
											</div>
										</div>

										<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
											{formatAnswerText(
												data.summarise?.questions?.at(randomIndex)?.[1],
											)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className="ppGradientOverlay absolute top-[0] left-[0] w-full h-full rounded-[20px]"
						style={{
							background: `linear-gradient(to bottom, transparent 50%, ${background})`,
							color,
						}}
					/>
				</div>
			</div>
		</>
	);
}

function useRandomUser(url: string) {
	const [randomOffset, setRandomOffset] = useState(0);

	useEffect(() => {
		// Random offset is now only generated client-side
		setRandomOffset(Math.floor(Math.random() * 3));
	}, []);

	return useMemo(() => {
		const getRandomUser = (title: string) => {
			// Create a consistent hash from the title
			let hash = 0;
			for (let i = 0; i < title.length; i++) {
				hash = (hash << 5) - hash + title.charCodeAt(i);
				hash = hash & hash; // Convert to 32-bit integer
			}
			// return random-looking but consistent user number
			return Math.abs(hash % (users.length - 3));
		};
		const baseUser = getRandomUser(url);
		const randomUser = baseUser + randomOffset;
		const randomIndex = randomUser % 3;

		return { randomUser, randomIndex };
	}, [url, randomOffset]);
}

function OldSchoolStyling() {
	return (
		<style jsx>{`
		.ppNewsCard {
			position:relative;
			display:flex;
			overflow:hidden;
			flex-direction:column;
			cursor:pointer;
			box-shadow:0 2px 40px rgba( 0,0,0,.9 );
			transition: transform .5s cubic-bezier(.215, .61, .355, 1),
						box-shadow .5s cubic-bezier(.215, .61, .355, 1);
			transform: perspective( 600px ) translate3d( 0, 0, 0 );
		}
		html {
			box-sizing: border-box;
		}
		*,*:before,*:after {
			box-sizing: inherit;
		}
		figure {
			margin: 0;
		}
		img {
			max-width: 100%;
			height: auto;
		}
		.ppNewsCard .cover {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.ppNewsCard__link {
			z-index: 30;
			display: block;
		}
		.ppNewsCard__pic {
			position: relative;
			z-index: 15;
			padding: 0;
			transition: transform .2s;
		}
		.ppNewsCard__pic img {
			display: block;
			transition: box-shadow 0.2s;
		}
		.ppNewsCard__host {
			z-index: 20;
			display: block;
		}
		.ppNewsCard__gradient {
			z-index: 5;
			transition: opacity 1s cubic-bezier(0.215, 0.61, 0.355, 1);
			opacity: 0.5;
			background: linear-gradient(120deg, #000000 0%, #000000 100%);
		}
		.ppGradientOverlay {
			z-index: 30;
			transition: transform .5s;
			transform: perspective(600px) translate3d(0, 0, 0);
		}
		.ppNewsCard__title {
			z-index: 15;
			transition: transform 1.0s;
			transform: perspective(600px) translate3d(0, 0, 0);
		}
		.ppNewsCard__qa {
			z-index: 15;
			transform: perspective(600px) translate3d(0, 0, 0);
		}
		.ppNewsCard__notice {
			opacity: 0 !important;
			z-index: 20;
			transition-delay: 1.0s;
			transition: transform 0.2s;
			transform: perspective(600px) translate3d(0, 140px, 0px);
		}
		/** 
		* Preserve 3D elements for the descendants 
		*/
		.ppNewsCard,
		.ppNewsCard__qa {
			transform-style: preserve-3d;
			backface-visibility: hidden;
		}
		/** 
		* Hover States 
		*/
		.ppNewsCard:hover {
			z-index: 1;
			box-shadow: 0 5px 40px rgba(0, 0, 0, 1.0);
		}
		.ppNewsCard:hover .ppNewsCard__gradient {
			opacity: .0;
		}
		@media (min-width: 1023px) {
			.ppNewsCard:hover .ppNewsCard__title {
				transition: transform 0.8s;
				transform: perspective(600px) translate3d(0, 0, -15px);
			}
			.ppNewsCard:hover .ppNewsCard__qa {
				transform: perspective(600px) translate3d(0, 0, 20px);
			}
			.ppNewsCard:hover .ppNewsCard__notice {
				opacity: .8 !important;
				transition-delay: 1.0s;
				transition: transform .4s;
				transform: perspective(600px) translate3d(0, 100px, 200px);
			}
			.ppNewsCard:hover .ppGradientOverlay {
				transition: transform .5s;
				transform: perspective(600px) translate3d(0, 200px, 0);
			}
		}
		@media (max-width: 1024px) {
			.ppNewsCard:hover .ppNewsCard__title {
				transition: transform 0.8s;
				transform: none;
			}
			.ppNewsCard:hover .ppNewsCard__qa {
				transform: none;
			}
			.ppNewsCard:hover .ppNewsCard__notice {
				opacity: .8 !important;
				transition-delay: 1.0s;
				transition: transform .4s;
				transform: none;
				transform: translate3d(0, 140px, 0px);
			}
			.ppNewsCard:hover .ppGradientOverlay {
				transition: transform .5s;
				transform: translate3d(0, 200px, 0);
			}
		}
	`}</style>
	);
}
