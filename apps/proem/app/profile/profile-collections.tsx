import { CollapsibleSection } from "@/components/collapsible-section";
import { CollectionListItem } from "@/components/collections/collection-list-item";
import { CreateEditCollection } from "@/components/collections/create-edit-collection";
import { FullSizeDrawer } from "@/components/full-page-drawer";
import { useUser } from "@clerk/nextjs";
import { Collection } from "@proemial/data/neon/schema";
import { Plus } from "@untitled-ui/icons-react";
import { useQuery } from "react-query";
import { getCollections } from "./actions";

export const ProfileCollections = () => {
	const { user } = useUser();
	const { data: collections } = useQuery<Collection[]>(
		"collections",
		async () => getCollections(user?.id ?? ""),
	);

	if (!collections) {
		return undefined;
	}

	return (
		<CollapsibleSection
			collapsed
			extra={<div>{collections.length}</div>}
			trigger={<div>Collections</div>}
		>
			<div className="space-y-4 mt-4">
				{collections.length === 0 && (
					<div className="text-sm">There are no collections to display.</div>
				)}
				{collections.map((collection) => (
					<CollectionListItem
						key={collection.id}
						collection={collection}
						onShare={() => alert("Sharing is not implemented")}
						onEdit={() => alert("Editing is not implemented")}
						onDelete={() => alert("Deletion is not implemented")}
					/>
				))}
				<FullSizeDrawer
					trigger={
						<div className="flex gap-2 items-center hover:opacity-85 active:opacity-75 duration-200 cursor-pointer">
							<Plus className="size-4 opacity-85" />
							<div className="text-sm">Create New Collection…</div>
						</div>
					}
				>
					<CreateEditCollection
						collection={{ id: "", name: "", ownerId: "" }}
						mode="create"
						onSubmit={() => alert("Creation not implemented")}
					/>
				</FullSizeDrawer>
			</div>
		</CollapsibleSection>
	);
};
