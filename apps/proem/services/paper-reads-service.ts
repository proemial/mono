import { ANONYMOUS_USER_ID } from "@/app/constants";
import { auth } from "@clerk/nextjs/server";
import { PaperRead } from "@proemial/data/neon/schema";
import { ensurePaperExistsInDb } from "@proemial/data/repository/paper";
import { PaperReadsRepository } from "@proemial/data/repository/paper-reads";
import { getOrCreateUser } from "@proemial/data/repository/user";
import dayjs from "dayjs";

export const PaperReadsService = {
	registerPaperRead: async (paperId: PaperRead["paperId"]) => {
		const { userId: authenticatedUserId } = auth();
		const userId = authenticatedUserId ?? ANONYMOUS_USER_ID;

		const existingPaperRead = await PaperReadsRepository.read({
			userId,
			paperId,
		});

		if (existingPaperRead) {
			const diffInMsFromNow = dayjs(new Date()).diff(
				existingPaperRead.lastReadAt,
				"milliseconds",
			);
			// Dirty hack to prevent multiple renders causing multiple reads
			// from being recorded in quick succession
			if (diffInMsFromNow > 5000) {
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
		return await PaperReadsRepository.create({ userId, paperId });
	},
};
