"use client";

import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { CollapsibleSection } from "@/components/collapsible-section";
import { CollectionListItem } from "@/components/collections/collection-list-item";
import { CreateCollection } from "@/components/collections/create-collection";
import { FullSizeDrawer } from "@/components/full-page-drawer";
import { useUser } from "@clerk/nextjs";
import { Collection, NewCollection } from "@proemial/data/neon/schema";
import { ScrollArea, cn } from "@proemial/shadcn-ui";
import { Plus } from "@untitled-ui/icons-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { PERSONAL_DEFAULT_COLLECTION_NAME } from "../constants";
import {
	addCollection,
	deleteCollection,
	editCollection,
	getCollections,
} from "./actions";

export const ProfileCollections = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();

	const { data: collections } = useQuery({
		queryKey: ["collections", user?.id],
		queryFn: async () => getCollections(user?.id ?? ""),
	});

	const { mutate: edit } = useMutation({
		mutationFn: (collection: Collection) =>
			editCollection(user?.id ?? "", collection),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", user?.id],
			});
		},
	});

	const { mutate: del } = useMutation({
		mutationFn: (collectionId: Collection["id"]) =>
			deleteCollection(user?.id ?? "", collectionId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", user?.id],
			});
		},
	});

	if (!collections || !user) {
		return null;
	}

	const customCollections = collections.filter(
		(collection) => collection.id !== user.id,
	);

	return (
		<CollapsibleSection
			extra={<div>{collections.length}</div>}
			trigger={<div>Collections</div>}
			trackingKey={analyticsKeys.ui.menu.click.collapse.collections}
		>
			<ScrollArea className={cn({ "h-[200px]": collections.length > 0 })}>
				<div className="space-y-4 mt-4">
					<CollectionListItem
						collection={{
							name: PERSONAL_DEFAULT_COLLECTION_NAME,
							id: user.id,
							slug: user.id,
							ownerId: user.id,
							description: "",
							createdAt: new Date(),
						}}
						onEdit={edit}
						onDelete={del}
						readonly={true}
					/>
					{customCollections.map((collection) => (
						<CollectionListItem
							key={collection.id}
							collection={collection}
							onEdit={edit}
							onDelete={del}
						/>
					))}
				</div>
			</ScrollArea>
			<CreateCollectionDrawer
				trigger={
					<div className="flex gap-2 items-center hover:opacity-85 active:opacity-75 duration-200 cursor-pointer">
						<Plus className="size-4 opacity-85" />
						<div className="text-sm">Create New Collection…</div>
					</div>
				}
			/>
		</CollapsibleSection>
	);
};

type CreateCollectionDrawerProps = {
	trigger: React.ReactNode;
};

export function CreateCollectionDrawer({
	trigger,
}: CreateCollectionDrawerProps) {
	const { user } = useUser();
	const queryClient = useQueryClient();

	const { mutate: add } = useMutation({
		mutationFn: (newCollection: NewCollection) =>
			addCollection(user?.id ?? "", newCollection),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", user?.id],
			});
		},
	});

	if (!user) {
		return null;
	}

	return (
		<FullSizeDrawer trigger={trigger}>
			<CreateCollection
				collection={{ name: "", description: "", ownerId: user.id }}
				onSubmit={add}
			/>
		</FullSizeDrawer>
	);
}
