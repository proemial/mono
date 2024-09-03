import { FindPaperRead } from "@proemial/data/neon/schema";
import { PaperReadsRepository } from "@proemial/data/repository/paper-reads";

export const PaperReadsService = {
	registerPaperRead: async ({ userId, paperId }: FindPaperRead) => {
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
