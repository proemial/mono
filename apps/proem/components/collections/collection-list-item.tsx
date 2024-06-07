import { Collection } from "@/app/profile/profile-you";
import { Button } from "@proemial/shadcn-ui";
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
import { FullSizeDrawer } from "../full-page-drawer";
import { CollectionListItemHeader } from "./collection-list-item-header";
import { CreateEditCollection } from "./create-edit-collection";
import { IconButton } from "./icon-button";

type Props = {
	collection: Collection;
	onClick?: () => void;
	onShare?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
};

export const CollectionListItem = ({
	collection,
	onClick,
	onShare,
	onEdit,
	onDelete,
}: Props) => {
	const { name, description } = collection;
	return (
		<div className="flex justify-between gap-2">
			<CollectionListItemHeader onClick={onClick}>
				<Folder className="size-4 opacity-85" />
				<div className="text-sm">{name}</div>
			</CollectionListItemHeader>
			<div className="flex gap-6 items-center">
				{/* Share */}
				<IconButton onClick={onShare} title="Share">
					<Upload01 className="size-4" />
				</IconButton>
				{/* Edit */}
				<FullSizeDrawer
					trigger={
						<IconButton title="Edit">
							<Edit03 className="size-4" />
						</IconButton>
					}
				>
					<CreateEditCollection
						collection={{ name, description }}
						mode="edit"
						// @ts-ignore: Settle on exact interface once real data is available
						onSubmit={onEdit}
					/>
				</FullSizeDrawer>
				{/* Delete */}
				<Dialog>
					<DialogTrigger>
						<IconButton title="Delete">
							<Trash01 className="size-4" />
						</IconButton>
					</DialogTrigger>
					<DialogContent>
						<DialogTitle>Delete {name}?</DialogTitle>
						<DialogClose>
							<div className="flex gap-6 justify-center py-4">
								<Button className="w-[80px] gap-1" onClick={onDelete}>
									<Check className="size-4 opacity-75" />
									Yes
								</Button>
								<Button className="w-[80px] gap-1">
									<X className="size-4 opacity-75" />
									No
								</Button>
							</div>
						</DialogClose>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};
