import { NavItem } from "@/app/(pages)/(app)/space/[collectionId]/nav-item";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { getPersonalDefaultCollection } from "@/app/constants";
import { routes } from "@/routes";
import { getOrgMembersUserData } from "@/utils/auth";
import { auth } from "@clerk/nextjs/server";
import { findCollectionWithPaperIdsBySlug } from "@proemial/data/repository/collection";
import { Avatar, AvatarImage, Paragraph } from "@proemial/shadcn-ui";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = CollectionIdParams & {
	children: ReactNode;
};
export default async function ({ params, children }: Props) {
	const { userId } = auth();
	if (!userId || !params?.collectionId) {
		redirect(routes.space);
	}

	const collection = await getCollection(params.collectionId, userId);
	if (!collection) {
		redirect(routes.space);
	}

	const orgMembersUserData = await getOrgMembersUserData();

	const isDefaultCollection = collection.id === userId;
	return (
		<div className="flex flex-col gap-2 grow">
			<div className="flex flex-col gap-3">
				{!isDefaultCollection && (
					<Paragraph>{collection.description}</Paragraph>
				)}
				<div className="flex flex-row-reverse items-center justify-between gap-2">
					<div className="flex gap-4">
						{/* <IconButton title="Add a paper…">
						<FilePlus02 className="size-[18px] opacity-75" />
					</IconButton>
					<IconButton>
						<Upload01 className="size-[18px] opacity-75" />
					</IconButton> */}
					</div>
					{!isDefaultCollection && orgMembersUserData ? (
						<div className="flex items-center gap-2">
							{orgMembersUserData.map((orgMember) => (
								<Avatar
									key={orgMember.userId}
									className="-ml-[18px] first:ml-0 size-6 hover:brightness-110 duration-200"
									title={
										orgMember.firstName && orgMember.lastName
											? `${orgMember.firstName} ${orgMember.lastName}`
											: undefined
									}
								>
									<AvatarImage src={orgMember.imageUrl} />
								</Avatar>
							))}
							<div className="text-sm">{orgMembersUserData.length} members</div>
						</div>
					) : null}
				</div>
			</div>
			<div className="flex items-center justify-center gap-1">
				<NavItem href={`${routes.space}/${collection.id}`} title="Latest" />
				<NavItem
					href={`${routes.space}/${collection.id}/saved`}
					title="Saved"
				/>
			</div>
			{children}
		</div>
	);
}
const getCollection = async (slug: string, userId: string) => {
	const collection = await findCollectionWithPaperIdsBySlug(slug);
	if (collection) {
		return collection;
	}
	if (slug === userId) {
		return getPersonalDefaultCollection(userId);
	}
	return undefined;
};
