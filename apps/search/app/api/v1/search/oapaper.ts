import { fetchSomeResults } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";

export type OpenAlexPaper = {
  title: string;
  abstract_inverted_index: { [key: string]: number[] };
};

// ,publication_date:>2023-10-16,publication_date:<2023-11-16
const baseUrl = "https://api.openalex.org/works?filter=is_oa:true";

export async function fetchPapers(q: string) {
  const query = `${baseUrl},abstract.search:${encodeURIComponent(q)}`;

  return await fetchSomeResults<OpenAlexPaper>(query, 3, (o) => ({
    title: o.title,
    abstract: fromInvertedIndex(o.abstract_inverted_index),
  }));
}
