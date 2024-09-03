import { NewPaperRead, PaperRead, paperReads } from "@/neon/schema/paper-reads";
import { and, eq, or } from "drizzle-orm";
import { neonDb } from "..";

export const PaperReadsRepository = {
	create: async (paperRead: NewPaperRead) => {
		const [result] = await neonDb
			.insert(paperReads)
			.values(paperRead)
			.returning();
		if (!result) {
			throw new Error("Failed to create paper read");
		}
		return result;
	},

	findById: async (
		userIdOrPaperId: PaperRead["userId"] | PaperRead["paperId"],
	) => {
		return await neonDb.query.paperReads.findFirst({
			where: or(
				eq(paperReads.userId, userIdOrPaperId),
				eq(paperReads.paperId, userIdOrPaperId),
			),
			with: {
				user: true,
				paper: true,
			},
		});
	},

	update: async (paperRead: PaperRead) => {
		const [result] = await neonDb
			.update(paperReads)
			.set({
				lastReadAt: paperRead.lastReadAt,
				readCount: paperRead.readCount,
			})
			.where(
				and(
					eq(paperReads.userId, paperRead.userId),
					eq(paperReads.paperId, paperRead.paperId),
				),
			)
			.returning();
		if (!result) {
			throw new Error("Failed to update paper read");
		}
		return result;
	},

	delete: async (
		userId: PaperRead["userId"],
		paperId: PaperRead["paperId"],
	) => {
		await neonDb
			.delete(paperReads)
			.where(
				and(eq(paperReads.userId, userId), eq(paperReads.paperId, paperId)),
			);
	},
};
