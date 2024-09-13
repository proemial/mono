import { ANONYMOUS_USER_ID } from "@/app/constants";
import { User } from "@/app/data/user";
import { auth } from "@clerk/nextjs/server";
import { PaperRead } from "@proemial/data/neon/schema";
import { ensurePaperExistsInDb } from "@proemial/data/repository/paper";
import { PaperReadsRepository } from "@proemial/data/repository/paper-reads";
import { getOrCreateUser } from "@proemial/data/repository/user";
import dayjs from "dayjs";

export type BasicReaderUserData = {
	id: string;
	firstName: string | null;
	lastName: string | null;
	imageUrl: string | undefined;
	readCount: number;
};

export const PaperReadsService = {
	increment: async (paperId: PaperRead["paperId"]) => {
		// TODO: Revalidate cache

		const { userId: authenticatedUserId } = auth();
		const userId = authenticatedUserId ?? ANONYMOUS_USER_ID;

		const existingPaperRead = await PaperReadsRepository.findByUserIdAndPaperId(
			{
				userId,
				paperId,
			},
		);

		if (existingPaperRead) {
			const diffInMsFromNow = dayjs(new Date()).diff(
				existingPaperRead.lastReadAt,
				"milliseconds",
			);
			// Dirty hack to prevent multiple renders causing multiple reads
			// from being recorded in quick succession
			if (diffInMsFromNow > 1000) {
				// TODO: Update stream cache (once it has been changed to use the `paper_reads` table)
				// waitUntil(streamCacheUpdate.run(userId, "user"));
				return await PaperReadsRepository.update({
					...existingPaperRead,
					lastReadAt: new Date(),
					readCount: existingPaperRead.readCount + 1,
				});
			}
		}

		// Ensure user and paper exist in the database
		await Promise.all([
			getOrCreateUser(userId),
			ensurePaperExistsInDb(paperId),
		]);
		// TODO: Update stream cache (once it has been changed to use the `paper_reads` table)
		// waitUntil(streamCacheUpdate.run(userId, "user"));
		return await PaperReadsRepository.create({ userId, paperId });
	},

	getAllByPaperId: async (paperId: PaperRead["paperId"]) =>
		await PaperReadsRepository.findAllByPaperId(paperId),

	getDistinctUserCount: async (paperId: PaperRead["paperId"]) =>
		await PaperReadsRepository.countDistinctUsers(paperId),

	getReaders: async (paperId: PaperRead["paperId"]) => {
		const paperReads = await PaperReadsService.getAllByPaperId(paperId);
		const readerIds = paperReads.map((paperRead) => paperRead.userId);
		const readers = (await User.getUsers(readerIds)).map(
			({ id, firstName, lastName, imageUrl }) => ({
				id,
				firstName,
				lastName,
				imageUrl,
			}),
		);
		return [
			...(readerIds.includes(ANONYMOUS_USER_ID)
				? [
						{
							id: ANONYMOUS_USER_ID,
							firstName: "Anonymous",
							lastName: null,
							imageUrl: undefined,
							readCount:
								paperReads.find((pr) => pr.userId === ANONYMOUS_USER_ID)
									?.readCount ?? 0,
						},
					]
				: []),
			...readers.map((reader) => ({
				...reader,
				readCount:
					paperReads.find((paperRead) => paperRead.userId === reader.id)
						?.readCount ?? 0,
			})),
		] satisfies BasicReaderUserData[];
	},
};
