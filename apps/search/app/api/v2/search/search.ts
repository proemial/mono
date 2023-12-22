// ,publication_date:>2023-10-16,publication_date:<2023-11-16
import { fetchJson } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import {
  OpenAlexWorksHit,
  OpenAlexWorksSearchResult,
} from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";

const fields = `
relevance_score,
id,
ids,
publication_date,
title,
language,
has_fulltext,
open_access,
primary_location,
authorships,
related_works,
abstract_inverted_index
`;

const filter = "filter=type:article,cited_by_count:>10,cited_by_count:<1000";
const baseUrl = `https://api.openalex.org/works?select=${fields}&${filter}`;

export async function fetchPapers(q: string, count = 30, tokens = 350) {
  const data = await fetchWithAbstract(q, count, tokens);

  await Redis.papers.push(data.map((o) => ({ data: o })));

  return data.map((o) => ({
    link: o.id.replace("openalex.org", "proem.ai/oa"),
    abstract: o.abstract,
    title: o.title,
  }));
}

type WithAbstract = OpenAlexWorksHit & { abstract?: string };

async function fetchWithAbstract(q: string, count: number, tokens: number) {
  const query = `${baseUrl},${q}&per-page=${count}`;

  const response = await fetchJson<OpenAlexWorksSearchResult>(query);
  console.log(`${response.results.length} papers returned matching ${q}`);

  return response.results.map((paper) => {
    // Remove the abstract_inverted_index and relevance_score from the response
    const { abstract_inverted_index, relevance_score, ...rest } = paper;

    return {
      ...rest,
      abstract: fromInvertedIndex(abstract_inverted_index, tokens),
    } as WithAbstract;
  });
}
