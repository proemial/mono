// https://export.arxiv.org/api/query?id_list=cond-mat/0102536v1

const arxivAtomPaper = `
<feed>
  <link href="http://arxiv.org/api/query?search_query%3D%26id_list%3D2405.01535%26start%3D0%26max_results%3D10" rel="self" type="application/atom+xml"/>
  <title type="html">ArXiv Query: search_query=&amp;id_list=2405.01535&amp;start=0&amp;max_results=10</title>
  <id>http://arxiv.org/api/hWYiPCugLIbZBbRcmwjTRKeOyag</id>
  <updated>2024-05-22T00:00:00-04:00</updated>
  <opensearch:totalResults xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">1</opensearch:totalResults>
  <opensearch:startIndex xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">0</opensearch:startIndex>
  <opensearch:itemsPerPage xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">10</opensearch:itemsPerPage>
  <entry>
    <id>http://arxiv.org/abs/2405.01535v1</id>
    <updated>2024-05-02T17:59:35Z</updated>
    <published>2024-05-02T17:59:35Z</published>
    <title>Prometheus 2: An Open Source Language Model Specialized in Evaluating
  Other Language Models</title>
    <summary>Proprietary LMs such as GPT-4 are often employed to assess the quality of
responses from various LMs. However, concerns including transparency,
controllability, and affordability strongly motivate the development of
open-source LMs specialized in evaluations. On the other hand, existing open
evaluator LMs exhibit critical shortcomings: 1) they issue scores that
significantly diverge from those assigned by humans, and 2) they lack the
flexibility to perform both direct assessment and pairwise ranking, the two
most prevalent forms of assessment. Additionally, they do not possess the
ability to evaluate based on custom evaluation criteria, focusing instead on
general attributes like helpfulness and harmlessness. To address these issues,
we introduce Prometheus 2, a more powerful evaluator LM than its predecessor
that closely mirrors human and GPT-4 judgements. Moreover, it is capable of
processing both direct assessment and pair-wise ranking formats grouped with a
user-defined evaluation criteria. On four direct assessment benchmarks and four
pairwise ranking benchmarks, Prometheus 2 scores the highest correlation and
agreement with humans and proprietary LM judges among all tested open evaluator
LMs. Our models, code, and data are all publicly available at
https://github.com/prometheus-eval/prometheus-eval.</summary>
    <author>
      <name>Seungone Kim</name>
    </author>
    <author>
      <name>Juyoung Suk</name>
    </author>
    <arxiv:comment xmlns:arxiv="http://arxiv.org/schemas/atom">Work in Progress</arxiv:comment>
    <link href="http://arxiv.org/abs/2405.01535v1" rel="alternate" type="text/html"/>
    <link title="pdf" href="http://arxiv.org/pdf/2405.01535v1" rel="related" type="application/pdf"/>
    <arxiv:primary_category xmlns:arxiv="http://arxiv.org/schemas/atom" term="cs.CL" scheme="http://arxiv.org/schemas/atom"/>
    <category term="cs.CL" scheme="http://arxiv.org/schemas/atom"/>
  </entry>
</feed>
`;

const openAlexWork = {
	id: "http://arxiv.org/abs/2405.01535v1",
	title:
		"Prometheus 2: An Open Source Language Model Specialized in Evaluating\n  Other Language Models",
	display_name:
		"Prometheus 2: An Open Source Language Model Specialized in Evaluating\n  Other Language Models",
	abstract: `Proprietary LMs such as GPT-4 are often employed to assess the quality of
responses from various LMs. However, concerns including transparency,
controllability, and affordability strongly motivate the development of
open-source LMs specialized in evaluations. On the other hand, existing open
evaluator LMs exhibit critical shortcomings: 1) they issue scores that
significantly diverge from those assigned by humans, and 2) they lack the
flexibility to perform both direct assessment and pairwise ranking, the two
most prevalent forms of assessment. Additionally, they do not possess the
ability to evaluate based on custom evaluation criteria, focusing instead on
general attributes like helpfulness and harmlessness. To address these issues,
we introduce Prometheus 2, a more powerful evaluator LM than its predecessor
that closely mirrors human and GPT-4 judgements. Moreover, it is capable of
processing both direct assessment and pair-wise ranking formats grouped with a
user-defined evaluation criteria. On four direct assessment benchmarks and four
pairwise ranking benchmarks, Prometheus 2 scores the highest correlation and
agreement with humans and proprietary LM judges among all tested open evaluator
LMs. Our models, code, and data are all publicly available at
https://github.com/prometheus-eval/prometheus-eval.`,
	publication_year: 2024,
	publication_date: "2024-05-02",
	ids: {
		arxiv: "http://arxiv.org/abs/2405.01535v1",
	},
	authorships: [
		{
			author: {
				display_name: "Seungone Kim",
			},
		},
		{
			author: {
				display_name: "Juyoung Suk",
			},
		},
	],
	primary_location: {
		is_oa: true,
		landing_page_url: "http://arxiv.org/abs/2405.01535v1",
		pdf_url: "http://arxiv.org/pdf/2405.01535v1",
		source: {
			id: "https://openalex.org/S4306400194",
			display_name: "arXiv (Cornell University)",
			is_oa: true,
			host_organization: "https://openalex.org/I205783295",
			host_organization_name: "Cornell University",
			type: "repository",
		},
		license: "",
		version: "publishedVersion",
		is_published: true,
	},
	locations: [
		{
			is_oa: true,
			landing_page_url: "http://arxiv.org/abs/2405.01535v1",
			pdf_url: "http://arxiv.org/pdf/2405.01535v1",
			source: {
				id: "https://openalex.org/S4306400194",
				display_name: "arXiv (Cornell University)",
				is_oa: true,
				host_organization: "https://openalex.org/I205783295",
				host_organization_name: "Cornell University",
				type: "repository",
			},
			license: "",
			version: "publishedVersion",
			is_published: true,
		},
	],
	best_oa_location: {
		is_oa: true,
		landing_page_url: "http://arxiv.org/abs/2405.01535v1",
		pdf_url: "http://arxiv.org/pdf/2405.01535v1",
		source: {
			id: "https://openalex.org/S4306400194",
			display_name: "arXiv (Cornell University)",
			is_oa: true,
			host_organization: "https://openalex.org/I205783295",
			host_organization_name: "Cornell University",
			type: "repository",
		},
		license: "",
		version: "publishedVersion",
		is_published: true,
	},

	language: "en",
	has_fulltext: true,
	related_works: [],
	open_access: {
		is_oa: true,
		oa_status: "unknown",
		oa_url: "http://arxiv.org/abs/2405.01535v1",
		any_repository_has_fulltext: true,
	},
	updated_date: "2024-05-02T17:59:35Z",
};

export const fixtures = {
	arxivAtomPaper,
	openAlexWork,
};
