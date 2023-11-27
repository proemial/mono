import { Log, Time } from "@/app/utils/time";

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

function fromInvertedIndex(index: { [key: string]: number[] }) {
  const begin = Time.now();

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
  const begin = Time.now();

  try {
    const response = await fetchJson<{ results: Array<T> }>(query);
    const some = response.results.slice(0, count);

    return !selector ? some : some.map(selector);
  } finally {
    Log.metrics(begin, "fetchSomeResults");
  }
}

async function fetchJson<T>(url: string) {
  const begin = Time.now();

  try {
    const response = await fetch(url);
    const json = await response.json();

    return json as T;
  } finally {
    Log.metrics(begin, "fetchJson");
  }
}
