import { Edit03, Folder, Trash01, Upload01 } from "@untitled-ui/icons-react";
import { CollectionListItemHeader } from "./collection-list-item-header";
import { IconButton } from "./icon-button";

type Props = {
	name: string;
	onClick?: () => void;
	onShare?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
};

export const CollectionListItem = ({
	name,
	onClick,
	onShare,
	onEdit,
	onDelete,
}: Props) => {
	return (
		<div className="flex justify-between gap-2">
			<CollectionListItemHeader onClick={onClick}>
				<Folder className="size-4 opacity-85" />
				<div className="text-sm">{name}</div>
			</CollectionListItemHeader>
			<div className="flex gap-6 items-center">
				<IconButton onClick={onShare} title="Share">
					<Upload01 className="size-4" />
				</IconButton>
				<IconButton onClick={onEdit} title="Edit">
					<Edit03 className="size-4" />
				</IconButton>
				<IconButton onClick={onDelete} title="Delete">
					<Trash01 className="size-4" />
				</IconButton>
			</div>
		</div>
	);
};
