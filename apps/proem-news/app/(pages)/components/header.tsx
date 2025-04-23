"use client";
import logo from "./images/logo.svg";
import Image from "next/image";
import { ArrowLeft, XClose } from "@untitled-ui/icons-react";
import { useState, useRef, useEffect } from "react";
import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { useIsApp } from "@/utils/app";
import { isBlockedUrl } from "../blocked";
import { usePathname } from "next/navigation";

export function Header() {
	const pathname = usePathname();
	const [modalOpen, setModalOpen] = useState(false);
	const isApp = useIsApp();

	console.log("isApp", isApp);

	return (
		<div
			className={`flex items-center gap-2 p-4 lg:px-8 self-stretch w-full flex-[0_0_auto] bg-black sticky top-0 z-50 ${isApp ? "pt-8" : ""}`}
		>
			{modalOpen && (
				<AnnotateForm modalOpen={modalOpen} setModalOpen={setModalOpen} />
			)}

			<div className="w-full flex justify-between items-center">
				{isApp && pathname !== "/" ? (
					<BackButton />
				) : (
					<LogoAndName isApp={isApp} />
				)}
			</div>
		</div>
	);
}

function AnnotateForm({
	modalOpen,
	setModalOpen,
}: {
	modalOpen: boolean;
	setModalOpen: (open: boolean) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const isApp = useIsApp();

	console.log("isApp", isApp);

	const placeholders = [
		"https://www.nytimes.com/health/covid-variants-symptoms",
		"https://www.theguardian.com/science/climate-study-findings",
		"https://www.scientificamerican.com/article/new-alzheimers-treatment",
		"https://www.nature.com/articles/covid-variants-symptoms",
		"https://www.sciencedaily.com/study-about-electric-cars",
	];
	const [currentPlaceholder, setCurrentPlaceholder] = useState(
		placeholders[Math.floor(Math.random() * placeholders.length)],
	);

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (!inputRef.current?.matches(":focus")) {
			interval = setInterval(() => {
				setCurrentPlaceholder((current) => {
					const currentIndex = placeholders.indexOf(current ?? "");
					return placeholders[(currentIndex + 1) % placeholders.length];
				});
			}, 5000);
		}

		if (modalOpen) {
			// Small delay to ensure the modal is rendered
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		}
	}, [modalOpen]);

	const dismiss = () => {
		setModalOpen(false);
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
			onClick={() => setModalOpen(false)}
		>
			<div
				className="w-full max-w-2xl mx-4 p-8 bg-white rounded-lg shadow-lg flex flex-col gap-0"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between ">
					<h2 className="text-xl font-bold tracking-tight">
						Annotate with science
					</h2>
					<button
						className="mt-[-20px]"
						type="button"
						onClick={() => dismiss()}
					>
						<XClose className="size-6" />
					</button>
				</div>

				<p className="text-muted-foreground">
					Paste link to an article to ask questions and gain insights from
					science.
				</p>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						const form = e.target as HTMLFormElement;
						const url = form.url.value;
						const isBlockedError = isBlockedUrl(url);

						// Check if it's a blocked URL
						if (isBlockedError) {
							const errorDiv = form.querySelector(
								".error-message",
							) as HTMLDivElement;
							errorDiv.textContent = isBlockedError;
							return;
						}

						form.querySelectorAll("button, input").forEach((el) => {
							(el as HTMLElement).setAttribute("disabled", "true");
						});
						dismiss();
						window.location.href = `/news/${encodeURIComponent(url)}`;
					}}
					className="flex flex-col gap-2 mt-4"
				>
					<input
						ref={inputRef}
						type="url"
						name="url"
						placeholder={currentPlaceholder}
						className="border border-gray-400 rounded-full p-3 bg-[#7DFA85]/10 placeholder:text-[#687269] text-black disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-[#7DFA85]"
						required
						onFocus={() => setCurrentPlaceholder(currentPlaceholder)}
						// @ts-ignore
						autofocus
					/>

					<div className="flex justify-end">
						<Trackable
							trackingKey={analyticsKeys.experiments.news.clickGenerate}
						>
							<button
								type="submit"
								className="px-4 py-2 flex gap-2 rounded-full text-center w-full bg-[#0A161C] text-[#7DFA85] hover:bg-[#061015] disabled:bg-green-600 disabled:cursor-not-allowed"
							>
								<div className="flex gap-2 p-1 items-center justify-center w-full">
									<Image className="w-4 h-4" alt="Frame" src={logo} />
									Annotate
								</div>
							</button>
						</Trackable>
					</div>
					<div className="text-red-500 text-sm error-message" />
				</form>
				<div className="text-sm italic text-muted-foreground mt-4">
					{isApp ? (
						<>Pro tip: Open articles in proem from any app or browser.</>
					) : (
						<>
							Pro tip: iOS app and Chrome extension is now beta.{" "}
							<a href="mailto:hi@proem.ai" className="underline">
								Write to Michael
							</a>{" "}
							if you want to become a beta tester.
						</>
					)}
				</div>
			</div>
		</div>
	);
}

function BackButton() {
	const goBackwards = () => {
		if (window.location.pathname.length < 7) {
			window.location.href = "/";
		} else {
			history.back();
		}
	};

	return (
		<Trackable trackingKey={analyticsKeys.experiments.news.header.clickBack}>
			<button
				type="button"
				onClick={goBackwards}
				className="text-[#f6f5e8] hover:text-[#d4d3c8]"
			>
				<ArrowLeft className="size-6" />
			</button>
		</Trackable>
	);
}

function LogoAndName({ isApp }: { isApp: boolean }) {
	return (
		<div className="items-center gap-2 flex-2 grow flex relative">
			<div className="font-semibold text-[#f6f5e8] text-base tracking-[0] leading-4">
				<Trackable
					trackingKey={analyticsKeys.experiments.news.header.clickLogo}
				>
					<a href="/" className="flex items-center gap-2">
						<Image
							className="w-[10.51px] h-4"
							alt="Logotype green logo"
							src={logo}
						/>
						<div className="font-semibold text-[#f6f5e8] text-base tracking-[0] leading-4">
							proem
						</div>
					</a>
				</Trackable>
			</div>
			{!isApp && (
				<div className="relative flex-1 tracking-[0] leading-4 text-[#93938f] pl-2 font-normal text-sm">
					trustworthy perspectives
				</div>
			)}
		</div>
	);
}
