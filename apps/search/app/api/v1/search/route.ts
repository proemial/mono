import { NextResponse } from "next/server";
import { OpenAlexPaper } from "@/app/api/v1/search/oapaper";

export const runtime = "edge";

// ,publication_date:>2023-10-16,publication_date:<2023-11-16
const baseUrl = "https://api.openalex.org/works?filter=is_oa:true";

export async function POST(req: Request) {
  const begin = DateMetrics.now();

  try {
    const { q } = await req.json();
    const query = `${baseUrl},abstract.search:${encodeURIComponent(q)}`;

    const response = await fetchSomeResults<OpenAlexPaper>(query, 3, (o) => ({
      title: o.title,
      abstract: fromInvertedIndex(o.abstract_inverted_index),
    }));

    return NextResponse.json(response);
  } finally {
    Log.metrics(begin, "api/v1/search");
  }
}

function fromInvertedIndex(index: { [key: string]: number[] }) {
  const begin = DateMetrics.now();

  try {
    const tokens = [] as string[];

    // @ts-ignore
    Object.keys(index).forEach((k) => index[k].forEach((a) => (tokens[a] = k)));

    return tokens.join(" ");
  } finally {
    Log.metrics(begin, "fromInvertedIndex");
  }
}

async function fetchSomeResults<T>(
  query: string,
  count: number,
  selector?: (item: T) => object,
) {
  const begin = DateMetrics.now();

  try {
    const response = await fetchJson<{ results: Array<T> }>(query);
    const some = response.results.slice(0, count);

    return !selector ? some : some.map(selector);
  } finally {
    Log.metrics(begin, "fetchSomeResults");
  }
}

async function fetchJson<T>(url: string) {
  const begin = DateMetrics.now();

  try {
    const response = await fetch(url);
    const json = await response.json();

    return json as T;
  } finally {
    Log.metrics(begin, "fetchJson");
  }
}

const Log = {
  metrics: (begin: number, message: string) => {
    console.log(`[${DateMetrics.elapsed(begin)}] ${message}`);
  },
};

const DateMetrics = {
  now: () => new Date().getTime(),
  elapsed: (begin: number) => DateMetrics.now() - begin,
};
