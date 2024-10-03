"use client";
import React, { useEffect, useState } from "react";
import {
	Button,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselDots,
} from "@proemial/shadcn-ui";
import { ArrowRight, X } from "@untitled-ui/icons-react";
import { setCookie, getCookie } from "cookies-next";
import {
	analyticsKeys,
	trackHandler,
} from "./analytics/tracking/tracking-keys";
import { usePostHog } from "posthog-js/react";

const items = [
	{
		header: "What is proem?",
		description: "Your daily dose of science, curated and bite-sized",
	},
	{
		header: "Dive deeper",
		description: "Ask questions and get answers based on scientific research",
	},
	{
		header: "Collaborate",
		description: "Make a knowledge space and invite collaborators",
	},
	{
		header: "Get started",
		description: "Read a paper below that you find interesting",
	},
];

export function OnboardingCarousel() {
	// Default true to avoid showing onboarding before the cookie is read
	const [closed, setClosed] = useState<boolean>(true);
	const posthog = usePostHog();

	useEffect(() => {
		setClosed(!!getCookie("onboardingClosed"));
	}, []);

	useEffect(() => {
		if (posthog.__loaded && !closed) {
			trackHandler(analyticsKeys.onboarding.view)();
		}
	}, [posthog.__loaded, closed]);

	if (closed) return undefined;

	// 2147483647
	const handleClose = () => {
		setClosed(true);
		setCookie("onboardingClosed", true, { maxAge: 365 * 24 * 60 * 60 });
		trackHandler(analyticsKeys.onboarding.close)();
	};

	const handleCardChange = () => {
		trackHandler(analyticsKeys.onboarding.jump)();
	};

	return (
		<div className="bg-black text-white mx-[-16px]">
			<Carousel onCardChange={handleCardChange}>
				<div className="absolute top-6 md:top-8 -right-[-16px] md:-right-[-32px] z-10">
					<Button variant="ghost" className="p-0 h-auto" onClick={handleClose}>
						<X className="text-gray-600" />
					</Button>
				</div>
				<CarouselContent>
					{items.map((item, index) => (
						<CarouselItem key={index}>
							<div className="px-4 py-6 md:px-8 md:py-12 cursor-grab">
								<div className="h-full flex flex-col justify-between">
									<div className="flex flex-col justify-center rounded-md select-none">
										<div className="text-gray-400 mb-6">{item.header}</div>
										<div className="font-light text-2xl md:text-3xl pr-16 pb-4 md:pb-6">
											{item.description}
										</div>
									</div>
									{index === items.length - 1 && (
										<Button
											variant="black"
											className="md:w-fit md:px-6 md:py-3"
											onClick={handleClose}
										>
											Got it
										</Button>
									)}
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselNext className="-right-[-16px] md:-right-[-32px]">
					<ArrowRight stroke="2px" className="h-16 w-16" />
				</CarouselNext>
				<CarouselDots />
			</Carousel>
		</div>
	);
}
