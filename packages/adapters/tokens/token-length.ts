import { getEncoding } from "js-tiktoken";

// Third-generation embedding models like `text-embedding-3-small` use the
// `cl100k_base` encoding.
const DEFAULT_ENCODING = "cl100k_base";

export const getTokenLength = (text: string) => {
	const encoding = getEncoding(DEFAULT_ENCODING);
	return encoding.encode(text).length;
};
