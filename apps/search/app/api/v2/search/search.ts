// ,publication_date:>2023-10-16,publication_date:<2023-11-16
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import { OpenAlexPaper } from "@proemial/models/open-alex";

const fields = "select=relevance_score,id,display_name,abstract_inverted_index";
const filter = "filter=type:article,cited_by_count:>10,cited_by_count:<1000";
const baseUrl = `https://api.openalex.org/works?${fields}&${filter}`;

export async function fetchPapers(q: string, count = 30, tokens = 350) {
  const query = `${baseUrl},${q}&per-page=${count}`;
  console.log("query", query);

  const response = await fetchJson<{ results: Array<OpenAlexPaper> }>(query);

  const result = response.results.map((o) => ({
    link: o.id.replace("openalex.org", "proem.ai/oa"),
    abstract: fromInvertedIndex(o.abstract_inverted_index, tokens), // avg 1,635 chars
  }));
  console.log("result size:", JSON.stringify(result).length);

  return result;
}
