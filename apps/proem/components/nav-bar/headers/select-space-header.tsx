import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { ChevronRight } from "@untitled-ui/icons-react";
import { eq } from "drizzle-orm";

type Props = {
	collectionName?: string;
};

export const SelectSpaceHeader = async ({ collectionName }: Props) => {
	const { userId } = auth();
	if (!userId) {
		throw new Error("User is missing");
	}

	const userCollections = await neonDb.query.collections.findMany({
		where: eq(collections.ownerId, userId),
	});

	// TODO: Select w/ user's collections

	return (
		<div className="flex gap-1 items-center">
			<div>{collectionName ?? "For You"}</div>
			<ChevronRight className="size-4" />
		</div>
	);
};
