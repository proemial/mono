"use client";

import { Collection } from "@proemial/data/neon/schema";
import { Button, DrawerClose } from "@proemial/shadcn-ui";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@proemial/shadcn-ui/components/ui/dialog";
import {
	Check,
	Edit03,
	Folder,
	Trash01,
	Upload01,
	X,
} from "@untitled-ui/icons-react";
import Link from "next/link";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { FullSizeDrawer } from "../full-page-drawer";
import { EditCollection } from "./edit-collection";
import { IconButton } from "./icon-button";

type Props = {
	collection: Collection;
	onShare?: () => void;
	onEdit: (collection: Collection) => void;
	onDelete: (collectionId: Collection["id"]) => void;
	readonly?: boolean;
};

export const CollectionListItem = ({
	collection,
	onShare,
	onEdit,
	onDelete,
	readonly,
}: Props) => {
	const { name, slug } = collection;

	const handleCollectionDelete = () => {
		trackHandler(analyticsKeys.collection.deleteFromMenuConfirmation);
		onDelete(collection.id);
	};

	return (
		<div className="flex justify-between gap-2">
			<Link
				href={`/collection/${slug}/stream`}
				onClick={() => {
					trackHandler(analyticsKeys.collection.openFromMenu);
				}}
			>
				<DrawerClose className="flex gap-2 items-center hover:opacity-85 active:opacity-75 duration-200">
					<Folder className="size-4 opacity-85" />
					<div className="text-sm">{name}</div>
				</DrawerClose>
			</Link>
			{!readonly && (
				<div className="flex gap-6 items-center">
					{/* Share */}
					{/* <IconButton onClick={onShare} title="Share">
						<Upload01 className="size-4" />
					</IconButton> */}
					{/* Edit */}
					<FullSizeDrawer
						trigger={
							<IconButton
								title="Edit"
								onClick={() => {
									trackHandler(analyticsKeys.collection.openEditFormFromMenu);
								}}
							>
								<Edit03 className="size-4" />
							</IconButton>
						}
					>
						<EditCollection collection={collection} onSubmit={onEdit} />
					</FullSizeDrawer>
					{/* Delete */}
					<Dialog>
						<DialogTrigger>
							<IconButton
								title="Delete"
								onClick={() => {
									trackHandler(analyticsKeys.collection.openDeleteFormFromMenu);
								}}
							>
								<Trash01 className="size-4" />
							</IconButton>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>Delete {name}?</DialogTitle>
							<div className="flex gap-6 justify-center py-4">
								<DialogClose asChild>
									<Button
										className="w-[80px] gap-1"
										onClick={handleCollectionDelete}
										autoFocus
									>
										<Check className="size-4 opacity-75" />
										Yes
									</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button
										className="w-[80px] gap-1"
										onClick={() =>
											trackHandler(
												analyticsKeys.collection.deleteFromMenuCancelation,
											)
										}
									>
										<X className="size-4 opacity-75" />
										No
									</Button>
								</DialogClose>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			)}
		</div>
	);
};
