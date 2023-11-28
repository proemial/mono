export type OpenAlexSearchResult = {
  meta: {
    count: number;
    page: number;
    per_page: number;
  };
  results: OpenAlexPaper[];
};

export type OpenAlexPaper = {
  id: string;
  doi: string;
  title: string;
  publication_date: string;
  updated_date: string;
  ids: {
    doi: string;
    pmid: string;
    pmcid: string;
    arxiv: string;
    jstor: string;
    ark: string;
    mag: string;
    hdl: string;
    purl: string;
    uri: string;
  };
  language: string;
  primary_location: OpenAlexLocation;
  type: string;
  open_access: {
    is_oa: boolean;
    oa_status: string;
    oa_url: string;
    any_repository_has_fulltext: boolean;
  };
  authorships: OpenAlexAuthorship[];
  corresponding_author_ids: string[];
  corresponding_institution_ids: string[];
  has_fulltext: boolean;
  fulltext_origin: string;
  cited_by_count: number;
  cited_by_percentile_year: {
    min: number;
    max: number;
  };
  biblio: {
    volume: string;
    issue: string;
    first_page: string;
    last_page: string;
  };
  keywords: OpenAlexKeyword[];
  concepts: OpenAlexConcept[];
  mesh: OpenAlexMeshNode[];
  locations: OpenAlexLocation[];
  best_oa_location: OpenAlexLocation;
  referenced_works: string[];
  related_works: string[];
  ngrams_url: string;
  cited_by_api_url: string;
  counts_by_year: OpenAlexCitationCount[];

  abstract_inverted_index: { [key: string]: number[] };
};

export type OpenAlexCitationCount = {
  year: number;
  cited_by_count: number;
};

export type OpenAlexMeshNode = {
  descriptor_ui: string;
  descriptor_name: string;
  qualifier_ui: string;
  qualifier_name: string;
  is_major_topic: boolean;
};

export type OpenAlexConcept = {
  id: string;
  wikidata: string;
  display_name: string;
  level: number;
  score: number;
};

export type OpenAlexKeyword = {
  keyword: string;
  score: number;
};

export type OpenAlexAuthorship = {
  author_position: "first" | "middle" | "last";
  author: {
    id: string;
    display_name: string;
    orcid: string;
  };
  institutions: OpenAlexInstitution[];
  countries: string[];
  is_corresponding: boolean;
  raw_affiliation_string: string;
  raw_affiliation_strings: string[];
};

export type OpenAlexInstitution = {
  id: string;
  display_name: string;
  country_code: string;
};

export type OpenAlexLocation = {
  is_oa: boolean;
  landing_page_url: string;
  pdf_url: string;
  source: {
    id: string;
    host_organization: string;
    host_organization_name: string;
    type: string;
  };
  license: string;
  version: "publishedVersion";
  is_published: boolean;
};
