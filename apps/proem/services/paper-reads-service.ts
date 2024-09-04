import { ANONYMOUS_USER_ID } from "@/app/constants";
import { streamCacheUpdate } from "@/inngest/populator.task";
import { auth } from "@clerk/nextjs/server";
import { PaperRead } from "@proemial/data/neon/schema";
import { ensurePaperExistsInDb } from "@proemial/data/repository/paper";
import { PaperReadsRepository } from "@proemial/data/repository/paper-reads";
import { getOrCreateUser } from "@proemial/data/repository/user";
import { waitUntil } from "@vercel/functions";
import dayjs from "dayjs";

export const PaperReadsService = {
	add: async (paperId: PaperRead["paperId"]) => {
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
			if (diffInMsFromNow > 5000) {
				// TODO: Update stream cache
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
		// TODO: Update stream cache
		// waitUntil(streamCacheUpdate.run(userId, "user"));
		return await PaperReadsRepository.create({ userId, paperId });
	},

	getAllByUserId: async (userId: PaperRead["userId"]) =>
		await PaperReadsRepository.findAllByUserId(userId),

	getAllByPaperId: async (paperId: PaperRead["paperId"]) =>
		await PaperReadsRepository.findAllByPaperId(paperId),
};
