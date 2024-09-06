import { count, desc, eq, sql } from "drizzle-orm";
import { neonDb } from "../neon/db";
import { paperReads, papers, posts } from "../neon/schema";

export namespace Paper {
	export const getMostPopular = ({
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
