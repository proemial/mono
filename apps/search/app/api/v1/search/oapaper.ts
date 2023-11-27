export type OpenAlexPaper = {
  title: string;
  abstract_inverted_index: { [key: string]: number[] };
};
