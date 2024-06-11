"use client";
import { Checkbox } from "@/components/checkbox";
import {
	Notification,
	openUnstyledNotifcation,
} from "@/components/notification";
import { Button, toast } from "@proemial/shadcn-ui";
import { useEffect, useState } from "react";

const TOAST_OPEN_DURATION = 4000;

type CollectionSelectorProps = {
	paperId: string;
};

function CollectionSelector({ paperId }: CollectionSelectorProps) {
	const collections = [
		"Your Collection",
		"immunology onboarding",
		"Cell therapy latest",
	];

	return (
		<Notification>
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
		</Notification>
	);
}

type CollectionNotificationProps = CollectionSelectorProps & {
	onClose?: () => void;
};

export function CollectionManager({
	onClose,
	paperId,
}: CollectionNotificationProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isTouched, setIsTouched] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!isTouched && isOpen) {
				onClose?.();
			}
		}, TOAST_OPEN_DURATION);

		return () => clearTimeout(timeoutId);
	}, [isOpen, isTouched, onClose]);

	return (
		<Notification>
			{isOpen ? (
				<CollectionSelector paperId={paperId} />
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
							showCollectionSelector(paperId);
							// setIsTouched(true);
							// setIsOpen(true);
						}}
					>
						Manage
					</Button>
				</div>
			)}
		</Notification>
	);
}

export function showCollectionSelector(
	paperId: CollectionSelectorProps["paperId"],
) {
	openUnstyledNotifcation(() => <CollectionSelector paperId={paperId} />);
}

export function showCollectionNotification(
	paperId: CollectionSelectorProps["paperId"],
) {
	openUnstyledNotifcation((toastId) => (
		<CollectionManager
			paperId={paperId}
			onClose={() => {
				toast.dismiss(toastId);
			}}
		/>
	));
}
