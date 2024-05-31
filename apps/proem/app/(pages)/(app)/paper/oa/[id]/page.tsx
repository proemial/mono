import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReader } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { users } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
	PaperPost,
	getOrgMemberPaperPosts,
	getOwnPaperPosts,
} from "../../paper-post-utils";

const description = "Read science fast";

type Props = {
	params: { id: string };
};

export default async function ReaderPage({ params }: Props) {
	const fetchedPaperPromise = fetchPaper(params.id).then((paper) => {
		if (!paper) {
			notFound();
		}

		return paper;
	});

	const generatedPaperPromise = fetchedPaperPromise.then((paper) => {
		return generate(paper);
	});

	// TODO: Remove feature flag
	const { isInternal } = getInternalUser();
	// Get paper posts from org members, or user's own posts if there are none
	let paperPosts: PaperPost[] = [];
	if (isInternal) {
		paperPosts = await getOrgMemberPaperPosts(params.id);
		if (paperPosts.length === 0) {
			paperPosts = await getOwnPaperPosts(params.id);
		}
	}

	await addPaperActivity(params.id);

	return (
		<Suspense fallback={<PaperReaderSkeleton />}>
			<PaperReader
				fetchedPaperPromise={fetchedPaperPromise}
				generatedPaperPromise={generatedPaperPromise}
				paperPosts={paperPosts}
			/>
		</Suspense>
	);
}

const addPaperActivity = async (paperId: string) => {
	const { userId } = auth();
	if (!userId) {
		return;
	}
	const user = await neonDb.query.users.findFirst({
		where: eq(users.id, userId),
	});
	if (!user) {
		return;
	}
	const existingActivities = user.paperActivities;
	const existingActivity = existingActivities.find(
		(a) => a.paperId === paperId,
	);
	if (existingActivity) {
		existingActivities[existingActivities.indexOf(existingActivity)] = {
			...existingActivity,
			lastReadAt: new Date().toISOString(),
			noOfReads: existingActivity.noOfReads + 1,
		};
	} else {
		existingActivities.push({
			paperId,
			lastReadAt: new Date().toISOString(),
			noOfReads: 1,
		});
	}
	// Sort activities by last read date (desc)
	const activitiesSortedReadDate = existingActivities.sort(
		(a, b) =>
			new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime(),
	);
	await neonDb
		.insert(users)
		.values({
			id: userId,
			paperActivities: activitiesSortedReadDate,
		})
		.onConflictDoUpdate({
			target: [users.id],
			set: {
				paperActivities: activitiesSortedReadDate,
			},
		});
};
