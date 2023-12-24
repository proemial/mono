import { OpenAlexPapers } from "./adapters/papers";
// Unused import fixes `Open
// The inferred type of "X" cannot be named without a reference to "Y". This is likely not portable. A type annotation is necessary.`
import { OpenAlexPaper } from "@proemial/models/open-alex";

export const Redis = {
  papers: OpenAlexPapers,
};
