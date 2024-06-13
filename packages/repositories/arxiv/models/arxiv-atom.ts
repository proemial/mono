type WithName = { name: string };
type WithTerm = { term: string };

export type ArXivCategory = {
	key: string;
	title: string;
	category: string;
};

export type RawArxivPaper = {
	id: string;
	updated: string;
	published: string;
	title: string;
	summary: string;
	author: WithName | Array<WithName>;
	comment: string;
	link: Array<{
		href: string;
		rel: "alternate" | "related" | "self";
		type: "text/html" | "application/pdf" | "application/atom+xml";
	}>;
	primary_category: {
		term: string;
	};
	category: WithTerm | Array<WithTerm>;
};

// export type ArXivAtomPaper = {
// 	parsed: {
// 		id: string,
// 		updated: Date,
// 		published: Date,
// 		category: string,
// 		categories: string[],
// 		authors: string[],
// 		link: {
// 			pdf: string,
// 			source: string,
// 		},
// 		title: string,
// 		abstract: string,
// 		hash: string,
// 	},
// 	raw: RawArxivPaper,
// 	summary?: string,
// 	lastUpdated: Date,
// }
//
// export const extractId = (url: string) => removeVersion(
// 	url.split('abs/').pop() as string
// );
// export const removeVersion = (id: string) => id.substring(0, id.lastIndexOf('v') || id.length - 1);
