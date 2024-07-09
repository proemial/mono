import { getOrgMembersUserData, getUser } from "@/utils/auth";
import { Collection } from "@proemial/data/neon/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@proemial/shadcn-ui";
import { Plus } from "@untitled-ui/icons-react";

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
						title={getFullName(ownerUser)}
					>
						<AvatarImage src={ownerUser.imageUrl} />
						<AvatarFallback className="text-xs">
							{getInitials(ownerUser)}
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
							title={getFullName(ownerUser)}
						>
							<AvatarImage src={ownerUser.imageUrl} />
							<AvatarFallback className="text-xs">
								{getInitials(ownerUser)}
							</AvatarFallback>
						</Avatar>
						<Plus className="size-4 opacity-75" />
						<div className="flex gap-2">
							{orgMembersUserData
								.filter((orgMember) => orgMember.userId !== ownerId)
								.map((orgMember) => (
									<Avatar
										key={orgMember.userId}
										className="-ml-[18px] first:ml-0 size-6 hover:brightness-110 duration-200"
										title={getFullName(orgMember)}
									>
										<AvatarImage src={orgMember.imageUrl} />
										<AvatarFallback className="text-xs">
											{getInitials(orgMember)}
										</AvatarFallback>
									</Avatar>
								))}
						</div>
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
						title={getFullName(ownerUser)}
					>
						<AvatarImage src={ownerUser.imageUrl} />
						<AvatarFallback className="text-xs">
							{getInitials(ownerUser)}
						</AvatarFallback>
					</Avatar>
					<div className="text-sm">{getFullName(ownerUser)}</div>
				</div>
			);
		}
	}
};

const getFullName = ({
	firstName,
	lastName,
}: { firstName: string | null; lastName: string | null }) => {
	if (firstName && lastName) return `${firstName} ${lastName}`;
	if (firstName) return firstName;
	if (lastName) return lastName;
	return undefined;
};

const getInitials = ({
	firstName,
	lastName,
}: { firstName: string | null; lastName: string | null }) => {
	if (firstName && lastName) return `${firstName[0]}${lastName[0]}`;
	if (firstName) return firstName[0];
	if (lastName) return lastName[0];
	return "?";
};
