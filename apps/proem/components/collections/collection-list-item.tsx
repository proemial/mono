import { Collection } from "@/app/profile/profile-you";
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
import { FullSizeDrawer } from "../full-page-drawer";
import { CreateEditCollection } from "./create-edit-collection";
import { IconButton } from "./icon-button";

type Props = {
	collection: Collection;
	onShare?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
};

export const CollectionListItem = ({
	collection,
	onShare,
	onEdit,
	onDelete,
}: Props) => {
	const { id, name, description } = collection;
	return (
		<div className="flex justify-between gap-2">
			<Link href={`/collection/${id}`} className="">
				<DrawerClose className="flex gap-2 items-center hover:opacity-85 active:opacity-75 duration-200">
					<Folder className="size-4 opacity-85" />
					<div className="text-sm">{name}</div>
				</DrawerClose>
			</Link>
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
						<DialogClose asChild>
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
