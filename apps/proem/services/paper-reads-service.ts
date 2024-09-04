import { ANONYMOUS_USER_ID } from "@/app/constants";
import { auth } from "@clerk/nextjs/server";
import { PaperRead } from "@proemial/data/neon/schema";
import { PaperReadsRepository } from "@proemial/data/repository/paper-reads";

export const PaperReadsService = {
	registerPaperRead: async (paperId: PaperRead["paperId"]) => {
		const { userId: authenticatedUserId } = auth();
		const userId = authenticatedUserId ?? ANONYMOUS_USER_ID;
		const existingPaperRead = await PaperReadsRepository.read({
			userId,
			paperId,
		});
		if (existingPaperRead) {
			return await PaperReadsRepository.update({
				...existingPaperRead,
				lastReadAt: new Date(),
				readCount: existingPaperRead.readCount + 1,
			});
		}
		return await PaperReadsRepository.create({ userId, paperId });
	},
};
