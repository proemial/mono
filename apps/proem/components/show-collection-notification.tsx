"use client";
import { Checkbox } from "@/components/checkbox";
import { Button, cn, toast } from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";

type CollectionNotificationProps = {
	onClose?: () => void;
};

const TOAST_OPEN_DURATION = 4000;

export function CollectionManager({ onClose }: CollectionNotificationProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isTouched, setIsTouched] = useState(false);
	const collections = [
		"Your Collection",
		"immunology onboarding",
		"Cell therapy latest",
	];

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!isTouched && isOpen) {
				onClose?.();
			}
		}, TOAST_OPEN_DURATION);

		return () => clearTimeout(timeoutId);
	}, [isOpen, isTouched, onClose]);

	return (
		<div
			className={cn("max-w-72 w-full bg-white rounded-xl shadow-2xl m-auto", {
				"h-10": !isOpen,
				"h-auto": isOpen,
			})}
		>
			{isOpen ? (
				<div className="divide-y pb-3">
					<p className="font-semibold text-center py-4">Added to Collection</p>
					{collections.map((collection) => (
						<div key={collection} className="px-4 py-2 text-base">
							<Checkbox id={collection}>{collection}</Checkbox>
						</div>
					))}
					{/* TODO! add */}
					{/* <div>
						<Button>Create new collection</Button>
					</div> */}
				</div>
			) : (
				<div className="flex justify-between items-center py-0.5 pl-2.5">
					<div className="flex items-center space-x-2">
						<Checkbox checked className="cursor-default" />
						<span className="text-sm">
							Added to <strong>Your Collection</strong>
						</span>
					</div>

					<Button
						variant="ghost"
						className="p-2.5 text-sm"
						onClick={() => {
							setIsTouched(true);
							setIsOpen(true);
						}}
					>
						Manage
					</Button>
				</div>
			)}
		</div>
	);
}

export function showCollectionNotification() {
	// Dismiss all existing toasts
	toast.dismiss();

	toast.custom(
		(toastId) => (
			<CollectionManager
				onClose={() => {
					toast.dismiss(toastId);
				}}
			/>
		),
		{
			style: { height: "unset", width: "100%", boxShadow: "none" },
			unstyled: true,
			cancel: true,
			// disabling automatically closing the toast to handle it programmatically instead
			duration: Number.POSITIVE_INFINITY,
		},
	);
}
