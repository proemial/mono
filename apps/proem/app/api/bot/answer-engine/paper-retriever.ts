import {
  BaseCallbackConfig,
  Callbacks,
} from "@langchain/core/callbacks/manager";
import { BaseRetriever } from "@langchain/core/retrievers";
import { DocumentInterface } from "@langchain/core/documents";
import { fetchPapers } from "../../paper-search/search";

type FetchPaperResult = {
  title: string;
  abstract?: string;
  link: string;
};

export class PaperRetriever extends BaseRetriever {
  lc_namespace = ["proemial", "retrievers", "PaperRetriever"];
  lc_name = 'PaperRetriever'

  async getRelevantDocuments(
    query: string,
    config?: Callbacks | BaseCallbackConfig
  ): Promise<DocumentInterface[]> {
    const papers = await fetchPapers(query);
    return papers.map(toRelativeLink).map(toDocument);
  }
}

const toRelativeLink = (paper: FetchPaperResult) => ({
  ...paper,
  link: paper.link.replace("https://proem.ai", ""),
});

const toDocument = (paper: FetchPaperResult): DocumentInterface => ({
  pageContent: legacyFormatPaper(paper),
  metadata: {}, // TODO: What should we put in here?
});

/**
 * @deprecated: A possible improvement could be a better formatting of papers,
 * e.g. using the fn below.
 */
const legacyFormatPaper = (paper: FetchPaperResult) =>
  JSON.stringify(paper)

const formatPaper = (paper: FetchPaperResult) =>
  `"""\nTitle: ${paper.title}\nLink: ${paper.link}\nAbstract: ${paper.abstract ?? ""}\n"""`;
