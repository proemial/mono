import { Time } from "./time";

export async function fetchSomeResults<T>(
  query: string,
  count: number,
  selector?: (item: T) => object,
) {
  const response = await fetchJson<{ results: Array<T> }>(query);
  const some = response.results.slice(0, count);

  return !selector ? some : some.map(selector);
}

export async function fetchJson<T>(url: string) {
  const begin = Time.now();

  try {
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }});
    const json = await response.json();

    return json as T;
  } finally {
    Time.log(begin, "fetchJson");
  }
}
