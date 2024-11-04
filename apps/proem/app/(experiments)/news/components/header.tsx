"use client";
import logo from "./images/logo.svg";
import Image from "next/image";
import { ArrowLeft, MagicWand02, PlusCircle } from "@untitled-ui/icons-react";
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

	return (
		<div
			className={`flex items-center gap-2 p-4 self-stretch w-full flex-[0_0_auto] bg-black sticky top-0 z-50 ${isApp ? "pt-8" : ""}`}
		>
			{modalOpen && (
				<AnnotateForm modalOpen={modalOpen} setModalOpen={setModalOpen} />
			)}

			<div className="w-full flex justify-between items-center">
				{isApp && pathname !== "/news" ? (
					<BackButton />
				) : (
					<LogoAndName isApp={isApp} />
				)}

				<Trackable trackingKey={analyticsKeys.experiments.news.header.clickAdd}>
					<PlusCircle
						className="text-[#f6f5e8] hsize-6 block hover:animate-[spin_1s_ease-in-out] cursor-pointer"
						onClick={() => setModalOpen(true)}
					/>
				</Trackable>
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

	useEffect(() => {
		if (modalOpen) {
			// Small delay to ensure the modal is rendered
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		}
	}, [modalOpen]);

	return (
		<div
			className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
			onClick={() => setModalOpen(false)}
		>
			<div
				className="bg-white p-6 rounded-lg shadow-lg"
				onClick={(e) => e.stopPropagation()}
			>
				Enter the URL of the content you want to annotate.
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const form = e.target as HTMLFormElement;
						const url = form.url.value;
						const isBlockedError = isBlockedUrl(url);

						// Check if it's a Facebook URL
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
						window.location.href = `/news/${encodeURIComponent(url)}`;
					}}
					className="flex flex-col gap-4"
				>
					<input
						ref={inputRef}
						type="url"
						name="url"
						placeholder="URL"
						className="border rounded p-2 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
					/>
					{isApp && (
						<div className="italic text-sm mt-[-16px] text-gray-500">
							Pro tip: you can share with proem from your browser.
						</div>
					)}
					<div className="text-red-500 text-sm error-message" />
					<div className="flex gap-2 justify-end">
						<button
							type="button"
							onClick={() => setModalOpen(false)}
							className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 disabled:bg-green-600 disabled:cursor-not-allowed"
						>
							<div className="flex gap-2 items-center">
								<MagicWand02 className="size-4" />
								Generate
							</div>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function BackButton() {
	return (
		<Trackable trackingKey={analyticsKeys.experiments.news.header.clickBack}>
			<button
				type="button"
				onClick={() => {
					if (
						window.location.pathname.startsWith("/news") &&
						window.location.pathname.length < 7
					) {
						window.location.href = "/news";
					} else {
						history.back();
					}
				}}
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
					<a href="/news/" className="flex items-center gap-2">
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
