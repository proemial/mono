import { NextResponse } from "next/server";
import { OpenAlexPaper } from "@/app/api/v1/search/oapaper";

export const runtime = "edge";
const baseUrl = "https://api.openalex.org/works?filter=is_oa:true";

export async function POST(req: Request) {
  const { q } = await req.json();

  // ,publication_date:>2023-10-16,publication_date:<2023-11-16
  const query = `${baseUrl},abstract.search:${encodeURIComponent(q)}`;
  console.log("api/v1/search", q);

  const response = await fetchSomeResults<OpenAlexPaper>(query, 3, (o) => ({
    title: o.title,
    abstract: fromInvertedIndex(o.abstract_inverted_index),
  }));

  return NextResponse.json(response);
}

function fromInvertedIndex(index: { [key: string]: number[] }) {
  const tokens = [] as string[];

  // @ts-ignore
  Object.keys(index).forEach((k) => index[k].forEach((a) => (tokens[a] = k)));

  return tokens.join(" ");
}

async function fetchSomeResults<T>(
  query: string,
  count: number,
  selector?: (item: T) => object,
) {
  const response = await fetchJson<{ results: Array<T> }>(query);
  const some = response.results.slice(0, count);

  return !selector ? some : some.map(selector);
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url);
  const json = await response.json();

  return json as T;
}
