import { count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { neonDb } from "../neon/db";
import { paperReads, papers, posts } from "../neon/schema";

export namespace Paper {
	export const Preview = z.object({
		id: z.string(),
		data: z.object({
			title: z.string(),
			// authors: z.array(z.string()),
			// topics: z.array(z.string()),
			// date: created_date & publication_date
		}),
		generated: z.object({
			tags: z.array(z.string()),
			hasAbstract: z.boolean(),
			title: z.string(),
			field: z.string(),
			provider: z.string(),
		}),
		// TODO! readers
		// TODO! posts
	});

	export type Preview = z.infer<typeof Preview>;

	export const Full = Preview.extend({
		abstract: z.string(),
	});

	export type Full = z.infer<typeof Full>;

	export const getByPopularity = ({
		limit = 5,
		offset = 0,
	}: {
		limit: number;
		offset: number;
	}) => {
		return neonDb
			.select({
				paperId: papers.id,
				paperReadsCount: count(paperReads.readCount),
				postsCount: count(posts.id),
			})
			.from(papers)
			.leftJoin(paperReads, eq(papers.id, paperReads.paperId))
			.leftJoin(posts, eq(papers.id, posts.paperId))
			.groupBy(papers.id)
			.having(sql`${count(paperReads.readCount)} + ${count(posts.id)} > 0`)
			.orderBy(
				desc(sql<number>`${count(paperReads.readCount)} + ${count(posts.id)}`),
			)
			.limit(limit)
			.offset(offset);
	};
}
