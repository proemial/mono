"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { CollectionListItem } from "@/components/collections/collection-list-item";
import { CreateCollection } from "@/components/collections/create-collection";
import { FullSizeDrawer } from "@/components/full-page-drawer";
import { PromptForSignIn } from "@/components/prompt-for-sign-in";
import { routes } from "@/routes";
import { PermissionUtils } from "@/utils/permission-utils";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";
import { Collection, NewCollection } from "@proemial/data/neon/schema";
import { Button, Header5 } from "@proemial/shadcn-ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { getPersonalDefaultCollection } from "../constants";
import {
	addCollection,
	deleteCollection,
	editCollection,
	getAvailableCollections,
} from "./actions";

export const ProfileCollections = () => {
	const { userId, orgId } = useAuth();
	const queryClient = useQueryClient();
	const { membership, memberships } = useOrganization({ memberships: true });
	const members =
		memberships?.data?.map((member) => member.publicUserData) ?? [];

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
		<div className="space-y-3">
			<div className="flex justify-center">
				<PromptForSignIn
					trigger={
						<Button
							variant="black"
							className="w-full flex gap-2 items-center"
							onClick={trackHandler(analyticsKeys.ui.menu.click.createSpace)}
						>
							<Plus className="size-4" />
							Create a space
						</Button>
					}
					restricted={
						<CreateCollectionDrawer
							trigger={
								<Button
									variant="black"
									className="flex gap-2 items-center"
									onClick={trackHandler(
										analyticsKeys.ui.menu.click.createSpace,
									)}
								>
									<Plus className="size-4" />
									Create a space
								</Button>
							}
							userId={userId}
							orgId={orgId}
						/>
					}
				/>
			</div>
			<div className="flex gap-2 justify-between">
				<Header5 className="opacity-50 select-none">Spaces</Header5>
				<Header5 className="opacity-50 select-none">{noOfCollections}</Header5>
			</div>
			<div className="flex flex-col">
				<CollectionListItem
					collection={getPersonalDefaultCollection(userId)}
					editable={false}
					author={
						members.find((member) => member.userId === userId) as
							| OrganizationMembershipPublicUserData
							| undefined
					}
				/>
				{nonDefaultCollections.map((collection) => (
					<CollectionListItem
						key={collection.id}
						collection={collection}
						editable={
							PermissionUtils.canEditCollection(collection, userId, orgId)
								? {
										onEdit: edit,
										onDelete: del,
									}
								: false
						}
						orgName={membership?.organization.name}
						author={
							members.find((member) => member.userId === collection.ownerId) as
								| OrganizationMembershipPublicUserData
								| undefined
						}
					/>
				))}
			</div>{" "}
		</div>
	);
};

type CreateCollectionDrawerProps = {
	trigger: React.ReactNode;
	userId: string;
	orgId: string | null | undefined;
};

export function CreateCollectionDrawer({
	trigger,
	userId,
	orgId,
}: CreateCollectionDrawerProps) {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutate: add } = useMutation({
		mutationFn: (newCollection: NewCollection) => addCollection(newCollection),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["collections", userId],
			});
			const spaceId = data?.id;
			router.push(`${routes.space}/${spaceId}/saved`);
		},
	});

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
