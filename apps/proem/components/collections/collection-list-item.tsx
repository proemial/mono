"use client";

import { routes } from "@/routes";
import { Collection } from "@proemial/data/neon/schema";
import { Button, DrawerClose } from "@proemial/shadcn-ui";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@proemial/shadcn-ui/components/ui/dialog";
import { Check, Edit03, Folder, Trash01, X } from "@untitled-ui/icons-react";
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
	editable:
		| {
				onEdit: (collection: Collection) => void;
				onDelete: (collectionId: Collection["id"]) => void;
		  }
		| false;
	orgName?: string;
};

export const CollectionListItem = ({
	collection,
	editable,
	orgName,
}: Props) => {
	const handleCollectionDelete = () => {
		if (!editable) return;
		trackHandler(analyticsKeys.collection.deleteFromMenuConfirmation);
		editable.onDelete(collection.id);
	};

	return (
		<div className="flex justify-between gap-2">
			<Link
				prefetch={false}
				href={`${routes.space}/${collection.id}`}
				onClick={() => {
					trackHandler(analyticsKeys.collection.openFromMenu);
				}}
			>
				<DrawerClose className="flex gap-2 items-center hover:opacity-85 active:opacity-75 duration-200">
					<Folder className="size-4 opacity-85" />
					<div className="text-sm">{collection.name}</div>
				</DrawerClose>
			</Link>
			<div className="flex gap-6 items-center">
				{/* Share state */}
				<div className="text-2xs uppercase opacity-50 truncate">
					{collection.shared === "organization"
						? orgName ?? collection.shared
						: collection.shared}
				</div>
				{/* Edit */}
				{editable ? (
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
						<EditCollection
							collection={collection}
							onSubmit={editable.onEdit}
							orgName={orgName}
						/>
					</FullSizeDrawer>
				) : (
					<div className="size-4" />
				)}
				{/* Delete */}
				{editable ? (
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
							<DialogTitle>Delete {collection.name}?</DialogTitle>
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
				) : (
					<div className="size-4" />
				)}
			</div>
		</div>
	);
};
