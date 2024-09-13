import { Organisation } from "@/app/data/organisation";
import { Collection } from "@proemial/data/neon/schema";
import { Lock01, LockUnlocked01 } from "@untitled-ui/icons-react";

type Props = {
	shared: Collection["shared"];
	organisationId?: string | null;
};

export const SpaceShareIndicator = async ({
	shared,
	organisationId,
}: Props) => {
	const orgMemberships = organisationId
		? await Organisation.getOrgMemberships(organisationId)
		: [];
	const organisation = orgMemberships[0]?.organization;

	switch (shared) {
		case "private":
			return (
				<div className="flex gap-1 items-center">
					<div className="text-sm">Private</div>
					<Lock01 className="size-4 opacity-75" />
				</div>
			);
		case "organization":
			return (
				<div className="flex gap-1 items-center">
					<div className="text-sm">{organisation?.name ?? "Organization"}</div>
					<Lock01 className="size-4 opacity-75" />
				</div>
			);
		case "public":
			return (
				<div className="flex gap-1 items-center">
					<div className="text-sm">Public</div>
					<LockUnlocked01 className="size-4 opacity-75" />
				</div>
			);
	}
};
