"use client";
import React, { useState } from "react";
import {
	Button,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselDots,
} from "@proemial/shadcn-ui";
import { ArrowRight, X } from "@untitled-ui/icons-react";
import { onLast } from "@proemial/utils/array";
import { setCookie, getCookie } from "cookies-next";

const items = [
	{
		header: "Who are we?",
		description: "We bake science into readable bitesized snacks",
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
		header: "Stay updated",
		description: "Read freshly baked science based on your interests",
	},
];

export function OnboardingCarousel() {
	// Default true to avoid showing onboarding before the cookie is read
	const [closed, setClosed] = useState<boolean>(true);

	React.useEffect(() => {
		setClosed(!!getCookie("onboardingClosed"));
	}, []);

	if (closed) return undefined;

	const handleOnboardingComplete = () => {
		setClosed(true);
		setCookie("onboardingClosed", true);
	};

	return (
		<div className="bg-black text-white mx-[-16px]">
			<Carousel>
				<div className="absolute top-6 md:top-12 -right-[-16px] md:-right-[-32px] z-10">
					<Button
						variant="ghost"
						className="p-0 h-auto"
						onClick={handleOnboardingComplete}
					>
						<X className="text-white" />
					</Button>
				</div>
				<CarouselContent>
					{items.map((item, index) => (
						<CarouselItem key={index}>
							<div className="aspect-video md:text-xl px-4 py-6 md:px-8 md:py-12">
								<div className="h-full flex flex-col justify-between">
									<div className="flex flex-col justify-center rounded-md">
										<div className="text-[#666666] mb-6">{item.header}</div>
										<div
											className={`text-xl md:text-2xl ${onLast(index, items, "pr-8")}`}
										>
											{item.description}
										</div>
									</div>
									{index === items.length - 1 && (
										<Button
											variant="black"
											className="md:text-xl"
											onClick={handleOnboardingComplete}
										>
											Get started
										</Button>
									)}
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselNext className="-right-[-16px] md:-right-[-32px]">
					<ArrowRight className="h-16 w-16" />
				</CarouselNext>
				<CarouselDots />
			</Carousel>
		</div>
	);
}
