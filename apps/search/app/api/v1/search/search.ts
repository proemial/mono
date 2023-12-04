// ,publication_date:>2023-10-16,publication_date:<2023-11-16
import { fetchSomeResults } from "@proemial/utils/fetch";
import { fromInvertedIndex } from "@proemial/utils/string";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import jp from "jsonpath";

const baseUrl = "https://api.openalex.org/works?filter=has_abstract:true";

export async function fetchPapers(
  q: string,
  count = 5,
  includes = [] as string[],
  filter = [] as string[],
) {
  const searchStr = `abstract.search:${encodeURIComponent(q)}`;
  const filterStr = filter?.length
    ? `,${filter.map(encodeURIComponent).join(",")}`
    : "";
  const query = `${baseUrl},${searchStr}${filterStr}`;
  console.log("query", query);

  return await fetchSomeResults<OpenAlexPaper>(query, count, (o) => {
    const queryData = {};

    includes.forEach((expr) => {
      if (o && expr) {
        const data = jp.query(o, expr);
        // @ts-ignore
        queryData[expr] = data.length > 1 ? data : data[0];
      }
    });

    return {
      ...queryData,
      title: o.title,
      link: o.id.replace("openalex.org", "proem.ai/oa"),
      abstract: fromInvertedIndex(o.abstract_inverted_index),
    };
  });
}
