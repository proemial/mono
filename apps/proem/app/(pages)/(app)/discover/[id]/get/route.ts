import { generate } from "@/app/(pages)/(app)/discover/[id]/llm-generate";
import { fetchPaper } from "@/old/(pages)/(app)/oa/[id]/fetch-paper";

export async function GET(request: Request) {
	const { pathname } = new URL(request.url);
	const paperId = pathname.split("/").at(-2);

	if (!paperId) {
		return new Response("No paperId found", {
			status: 400,
		});
	}
	const paper = await fetchPaper(paperId);

	if (!paper) {
		return new Response("No paper found", {
			status: 400,
		});
	}
	const updatedPaper = await generate(paper);

	return Response.json(updatedPaper);
}
