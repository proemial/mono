import { getOrgMemberships } from "@/utils/auth";
import { Collection } from "@proemial/data/neon/schema";
import { Lock01, LockUnlocked01 } from "@untitled-ui/icons-react";

type Props = {
	shared: Collection["shared"];
};

export const SpaceShareIndicator = async ({ shared }: Props) => {
	const orgMemberships = await getOrgMemberships();
	const org = orgMemberships[0]?.organization;

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
					<div className="text-sm">{org?.name ?? "Organization"}</div>
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
