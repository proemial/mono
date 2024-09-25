"use client";

import { routes } from "@/routes";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";
import { Collection } from "@proemial/data/neon/schema";
import {
	Button,
	DrawerClose,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@proemial/shadcn-ui";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@proemial/shadcn-ui/components/ui/dialog";
import {
	ArrowRight,
	Building05,
	Check,
	Edit03,
	Globe01,
	Lock01,
	Trash01,
	X,
} from "@untitled-ui/icons-react";
import Link from "next/link";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { FullSizeDrawer } from "../full-page-drawer";
import { UserAvatar } from "../user-avatar";
import { EditCollection } from "./edit-collection";

type Props = {
	collection: Collection;
	editable:
		| {
				onEdit: (collection: Collection) => void;
				onDelete: (collectionId: Collection["id"]) => void;
		  }
		| false;
	orgName?: string;
	author?: OrganizationMembershipPublicUserData;
};

export const CollectionListItem = ({
	collection,
	editable,
	orgName,
	author,
}: Props) => {
	return (
		<div className="flex justify-between gap-2 items-center hover:bg-[#e8e8e8] -mx-2 px-2 py-1 rounded-md group">
			<Link
				prefetch={false}
				href={`${routes.space}/${collection.id}`}
				onClick={trackHandler(analyticsKeys.collection.openFromMenu)}
				className="text-sm select-none truncate"
			>
				<DrawerClose className="flex">
					<div className="truncate">{collection.name}</div>
				</DrawerClose>
			</Link>
			<div className="flex gap-1 items-center justify-end">
				{editable && (
					<div className="flex pl-4">
						<Edit
							space={collection}
							editFn={editable.onEdit}
							orgName={orgName}
						/>
						<Delete space={collection} deleteFn={editable.onDelete} />
					</div>
				)}
				<ShareIcon shareSetting={collection.shared} orgName={orgName} />
				<UserAvatar authorUserData={author} className="size-5" />
				<Link
					prefetch={false}
					href={`${routes.space}/${collection.id}`}
					onClick={trackHandler(analyticsKeys.collection.openFromMenu)}
				>
					<DrawerClose className="hover:opacity-85 active:opacity-75 duration-200">
						<Button
							size="icon"
							className="bg-transparent hover:bg-transparent -mr-1.5 w-7 h-7"
						>
							<ArrowRight className="size-4" />
						</Button>
					</DrawerClose>
				</Link>
			</div>
		</div>
	);
};

const ShareIcon = ({
	shareSetting,
	orgName,
}: { shareSetting: Collection["shared"]; orgName: string | undefined }) => {
	const getIcon = () => {
		switch (shareSetting) {
			case "public":
				return {
					icon: <Globe01 className="size-3.5 opacity-85 cursor-help" />,
					title: "Shared publicly with everybody",
				};
			case "organization":
				return {
					icon: <Building05 className="size-3.5 opacity-85 cursor-help" />,
					title: `Shared within the ${orgName} organization`,
				};
			case "private":
				return {
					icon: <Lock01 className="size-3.5 opacity-85 cursor-help" />,
					title: "Private space, only available to you",
				};
		}
	};

	const { icon, title } = getIcon();

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="pl-1 pr-3">{icon}</div>
			</TooltipTrigger>
			<TooltipContent>
				<p>{title}</p>
			</TooltipContent>
		</Tooltip>
	);
};

const Edit = ({
	space,
	editFn,
	orgName,
}: {
	space: Collection;
	editFn: (space: Collection) => void;
	orgName: string | undefined;
}) => {
	return (
		<FullSizeDrawer
			trigger={
				<Button
					size="icon"
					className="bg-transparent hover:bg-transparent w-7 h-7 hidden group-hover:flex"
					title="Edit"
					onClick={trackHandler(analyticsKeys.collection.openEditFormFromMenu)}
				>
					<Edit03 className="size-3.5" />
				</Button>
			}
		>
			<EditCollection collection={space} onSubmit={editFn} orgName={orgName} />
		</FullSizeDrawer>
	);
};

const Delete = ({
	space,
	deleteFn,
}: {
	space: Collection;
	deleteFn: ((spaceId: Collection["id"]) => void) | undefined;
}) => {
	const handleCollectionDelete = () => {
		if (!deleteFn) return;
		trackHandler(analyticsKeys.collection.deleteFromMenuConfirmation)();
		deleteFn(space.id);
	};

	return (
		<Dialog>
			<DialogTrigger>
				<Button
					size="icon"
					className="bg-transparent hover:bg-transparent w-7 h-7 hidden group-hover:flex"
					title="Delete"
					onClick={trackHandler(
						analyticsKeys.collection.openDeleteFormFromMenu,
					)}
				>
					<Trash01 className="size-3.5" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Delete {space.name}?</DialogTitle>
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
							onClick={trackHandler(
								analyticsKeys.collection.deleteFromMenuCancelation,
							)}
						>
							<X className="size-4 opacity-75" />
							No
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
