import { getOrgMembersUserData, getUser } from "@/utils/auth";
import { Collection } from "@proemial/data/neon/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@proemial/shadcn-ui";
import { Plus } from "@untitled-ui/icons-react";
import { AuthorAvatar, getFullName, getInitials } from "./author-avatar";

type Props = {
	collection: Collection;
};

export const SpaceContributorsIndicator = async ({ collection }: Props) => {
	const { ownerId, shared } = collection;
	const ownerUser = await getUser(ownerId);
	if (!ownerUser) return <div />;

	switch (shared) {
		case "private": {
			return (
				<div className="flex items-center gap-2">
					<Avatar
						className="size-6 hover:brightness-110 duration-200"
						title={getFullName(ownerUser.firstName, ownerUser.lastName)}
					>
						<AvatarImage src={ownerUser.imageUrl} />
						<AvatarFallback className="text-xs">
							{getInitials(ownerUser.firstName, ownerUser.lastName)}
						</AvatarFallback>
					</Avatar>
					<div className="text-sm">Only You</div>
				</div>
			);
		}
		case "organization": {
			const orgMembersUserData = await getOrgMembersUserData();
			return (
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1">
						<Avatar
							className="size-6 hover:brightness-110 duration-200"
							title={getFullName(ownerUser.firstName, ownerUser.lastName)}
						>
							<AvatarImage src={ownerUser.imageUrl} />
							<AvatarFallback className="text-xs">
								{getInitials(ownerUser.firstName, ownerUser.lastName)}
							</AvatarFallback>
						</Avatar>
						{orgMembersUserData.length > 1 && (
							<>
								<Plus className="size-4 opacity-75" />
								<div className="flex gap-2">
									{orgMembersUserData
										.filter((orgMember) => orgMember.userId !== ownerId)
										.map((orgMember) => (
											<AuthorAvatar
												key={orgMember.userId}
												firstName={orgMember.firstName}
												lastName={orgMember.lastName}
												imageUrl={orgMember.imageUrl}
											/>
										))}
								</div>
							</>
						)}
					</div>
					<div className="text-sm">{orgMembersUserData.length} People</div>
				</div>
			);
		}
		case "public": {
			return (
				<div className="flex items-center gap-2">
					<Avatar
						className="size-6 hover:brightness-110 duration-200"
						title={getFullName(ownerUser.firstName, ownerUser.lastName)}
					>
						<AvatarImage src={ownerUser.imageUrl} />
						<AvatarFallback className="text-xs">
							{getInitials(ownerUser.firstName, ownerUser.lastName)}
						</AvatarFallback>
					</Avatar>
					<div className="text-sm">
						{getFullName(ownerUser.firstName, ownerUser.lastName)}
					</div>
				</div>
			);
		}
	}
};
