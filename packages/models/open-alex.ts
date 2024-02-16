// https://docs.openalex.org/api-entities/works/search-works
export type OpenAlexWorksSearchResult = {
  meta: {
    count: number;
    page: number;
    per_page: number;
  };
  results: OpenAlexWorksHit[];
};

export type OpenAlexWorksHit = OpenAlexWorkCoreMetadata & {
  relevance_score: number;
};

export type OpenAlexPaperWithAbstract = OpenAlexWorkMetadata & {
  abstract?: string;
};

// Parsed version of work
export type OpenAlexPaper = {
  id: string;
  data: OpenAlexPaperWithAbstract;
  generated?: {
    title?: string;
    tags?: string[];
    starters?: string[];
  };
};

export const baseOaUrl = "https://api.openalex.org/works";

export function getIdFromOpenAlexPaper(paper: OpenAlexPaper) {
  return paper.data.id.split("/").at(-1) as string;
}

// Fields to request from OpenAlex (the ones from OpenAlexWorkMetadata)
export const openAlexFields = {
  all: "id,doi,title,display_name,publication_date,updated_date,ids,language,primary_location,best_oa_location,locations,open_access,authorships,corresponding_author_ids,corresponding_institution_ids,has_fulltext,fulltext_origin,cited_by_count,cited_by_percentile_year,keywords,concepts,referenced_works,related_works,ngrams_url,cited_by_api_url,counts_by_year,abstract_inverted_index,topics",
  search:
    "relevance_score,id,ids,publication_date,title,language,has_fulltext,open_access,primary_location,authorships,related_works,abstract_inverted_index",
};

export type OpenAlexWorkCoreMetadata = {
  id: string;
  ids: {
    [K in PaperId]: string;
  };
  publication_date: string;
  title: string;
  language: string;
  has_fulltext: boolean;

  open_access: {
    is_oa: boolean;
    oa_status: string;
    oa_url: string;
    any_repository_has_fulltext: boolean;
  };

  primary_location: OpenAlexLocation;
  authorships: OpenAlexAuthorship[];
  related_works: string[];

  abstract_inverted_index?: { [key: string]: number[] };
};

export type OpenAlexWorkMetadata = OpenAlexWorkCoreMetadata & {
  doi: string;

  updated_date: string;
  best_oa_location: OpenAlexLocation;
  locations: OpenAlexLocation[];

  corresponding_author_ids: string[];
  corresponding_institution_ids: string[];
  fulltext_origin: string;
  cited_by_count: number;
  cited_by_percentile_year: {
    min: number;
    max: number;
  };
  keywords: OpenAlexKeyword[];
  concepts: OpenAlexConcept[];
  referenced_works: string[];
  ngrams_url: string;
  cited_by_api_url: string;
  counts_by_year: OpenAlexCitationCount[];
  topics?: OpenAlexTopic[];
};

export type PaperId =
  | "doi"
  | "pmid"
  | "pmcid"
  | "arxiv"
  | "jstor"
  | "ark"
  | "mag"
  | "hdl"
  | "purl"
  | "uri";

export type OpenAlexTopic = {
  id: string;
  display_name: string;
  score: number;
  subfield: OpenAlexTopicItem;
  field: OpenAlexTopicItem;
  domain: OpenAlexTopicItem;
};

type OpenAlexTopicItem = {
  id: number;
  display_name: string;
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
    display_name: string;
    host_organization: string;
    host_organization_name: string;
    type: string;
  };
  license: string;
  version: "publishedVersion";
  is_published: boolean;
};
