"use client";

import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { CollapsibleSection } from "@/components/collapsible-section";
import { CollectionListItem } from "@/components/collections/collection-list-item";
import { CreateCollection } from "@/components/collections/create-collection";
import { FullSizeDrawer } from "@/components/full-page-drawer";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { Collection, NewCollection } from "@proemial/data/neon/schema";
import { Plus } from "@untitled-ui/icons-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPersonalDefaultCollection } from "../constants";
import {
	addCollection,
	deleteCollection,
	editCollection,
	getAvailableCollections,
} from "./actions";

export const ProfileCollections = () => {
	const { userId } = useAuth();
	const queryClient = useQueryClient();
	const { membership } = useOrganization();

	const { data: collections } = useQuery({
		queryKey: ["collections", userId],
		queryFn: async () => getAvailableCollections(),
	});

	const { mutate: edit } = useMutation({
		mutationFn: (collection: Collection) => editCollection(collection),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", userId],
			});
		},
	});

	const { mutate: del } = useMutation({
		mutationFn: (collectionId: Collection["id"]) =>
			deleteCollection(collectionId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", userId],
			});
		},
	});

	if (!collections || !userId) {
		return null;
	}

	const nonDefaultCollections = collections.filter(
		(collection) => collection.id !== userId,
	);

	const noOfCollections = collections.length > 0 ? collections.length : 1;

	return (
		<CollapsibleSection
			extra={<div>{noOfCollections}</div>}
			trigger={<div>Spaces</div>}
			trackingKey={analyticsKeys.ui.menu.click.collapse.collections}
		>
			<div className="space-y-3">
				<CollectionListItem
					collection={getPersonalDefaultCollection(userId)}
					editable={false}
				/>
				{nonDefaultCollections.map((collection) => (
					<CollectionListItem
						key={collection.id}
						collection={collection}
						editable={{
							onEdit: edit,
							onDelete: del,
						}}
						orgName={membership?.organization.name}
					/>
				))}
			</div>
			<CreateCollectionDrawer
				trigger={
					<div className="flex gap-2 items-center hover:opacity-85 active:opacity-75 duration-200 cursor-pointer">
						<Plus className="size-4 opacity-85" />
						<div className="text-sm">Create New Space</div>
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
	const { userId, orgId } = useAuth();
	const queryClient = useQueryClient();

	const { mutate: add } = useMutation({
		mutationFn: (newCollection: NewCollection) => addCollection(newCollection),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", userId],
			});
		},
	});

	if (!userId) {
		return null;
	}

	return (
		<FullSizeDrawer trigger={trigger}>
			<CreateCollection
				collection={{
					name: "",
					description: "",
					ownerId: userId,
					orgId,
					shared: orgId ? "organization" : "public",
				}}
				onSubmit={add}
			/>
		</FullSizeDrawer>
	);
}
