import { fetchPapers } from "@/app/api/paper-search/search";

export function searchPapers(searchQuery: string) {
	console.log("search papers", searchQuery);
	return `${searchQuery} is 100 pages long`;
	// return {
	// 	papers: [{ title: searchQuery, length: 100 }],
	// };
	// return fetchPapers(searchQuery);
}
