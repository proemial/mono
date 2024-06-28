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
import { getPersonalDefaultCollection } from "../constants";
import {
	addCollection,
	deleteCollection,
	editCollection,
	getAvailableCollections,
} from "./actions";

type Props = {
	orgName?: string;
};

export const ProfileCollections = ({ orgName }: Props) => {
	const { user } = useUser();
	const queryClient = useQueryClient();

	const { data: collections } = useQuery({
		queryKey: ["collections", user?.id],
		queryFn: async () => getAvailableCollections(),
	});

	const { mutate: edit } = useMutation({
		mutationFn: (collection: Collection) => editCollection(collection),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["collections", user?.id],
			});
		},
	});

	const { mutate: del } = useMutation({
		mutationFn: (collectionId: Collection["id"]) =>
			deleteCollection(collectionId),
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

	const noOfCollections = collections.length > 0 ? collections.length : 1;

	return (
		<CollapsibleSection
			extra={<div>{noOfCollections}</div>}
			trigger={<div>Spaces</div>}
			trackingKey={analyticsKeys.ui.menu.click.collapse.collections}
		>
			<ScrollArea className={cn({ "h-[200px]": collections.length > 0 })}>
				<div className="space-y-4 mt-4">
					<CollectionListItem
						collection={getPersonalDefaultCollection(user.id)}
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
							orgName={orgName}
							userId={user.id}
						/>
					))}
				</div>
			</ScrollArea>
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
	const { user } = useUser();
	const queryClient = useQueryClient();

	const { mutate: add } = useMutation({
		mutationFn: (newCollection: NewCollection) => addCollection(newCollection),
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
