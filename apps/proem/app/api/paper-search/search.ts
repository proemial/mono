// ,publication_date:>2023-10-16,publication_date:<2023-11-16
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import {
  baseOaUrl,
  OpenAlexPaperWithAbstract,
  openAlexFields,
  OpenAlexWorksSearchResult,
} from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";

const filter = "filter=type:article,cited_by_count:>10,cited_by_count:<1000";
const baseUrl = `${baseOaUrl}?select=${openAlexFields.search}&${filter}`;

export async function fetchPapers(q: string, count = 30, tokens = 350) {
  const papers = await fetchWithAbstract(q, count, tokens);

  await Redis.papers.pushAll(papers.map((data) => ({ data, id: data.id })));

  return papers.map((o) => ({
    link: o.id.replace("openalex.org", "proem.ai/oa"),
    abstract: o.abstract,
    title: o.title,
  }));
}

async function fetchWithAbstract(q: string, count: number, tokens: number) {
  const query = `${baseUrl},${q}&per-page=${count}`;

  const response = await fetchJson<OpenAlexWorksSearchResult>(query);
  console.log(`${response.results.length} papers returned matching ${q}`);

  // TODO: Move to share transform function
  return response.results.map((paper) => {
    // Remove the abstract_inverted_index and relevance_score from the response
    const { abstract_inverted_index, relevance_score, ...rest } = paper;

    return {
      ...rest,
      abstract: fromInvertedIndex(abstract_inverted_index, tokens),
    } as OpenAlexPaperWithAbstract;
  });
}
