export function fromInvertedIndex(
	index?: { [key: string]: number[] },
	tokenLimit?: number,
) {
	if (!index) return undefined;
	const tokens = [] as string[];

	// @ts-ignore
	Object.keys(index).forEach((k) => index[k].forEach((a) => (tokens[a] = k)));

	if (!!tokenLimit && tokens.length > tokenLimit) {
		const pre = tokens.slice(0, tokenLimit);
		const begin = pre.join(" ");

		const post = tokens.slice(tokenLimit, tokens.length);
		const postStr = post.join(" ");

		const postEndIndex =
			postStr.indexOf(".") + 1 == postStr.length
				? postStr.indexOf(".") + 1
				: postStr.indexOf(". ") + 1;
		const end = postStr.substring(0, postEndIndex);

		return begin + " " + end;
	}

	// const fullText = tokens.join(" ");
	// if (!!limit && fullText.length > limit) {
	//   const atLength = fullText.substring(0, limit);
	//   const atPunctuation = atLength.substring(0, atLength.lastIndexOf(".") + 1);
	//   console.log(
	//     "atPunctuation",
	//     atPunctuation.length,
	//     atPunctuation.substring(atPunctuation.length - 20, atPunctuation.length),
	//   );
	//
	//   return atPunctuation;
	// }

	return tokens.join(" ");
}

export async function sha256(rawData: string) {
	const data =
		typeof rawData === "object" ? JSON.stringify(rawData) : String(rawData);

	const msgBuffer = new TextEncoder().encode(data);
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function hashFrom(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

export function numberFrom(text: string, max = 9): number {
	const index = Math.abs(hashFrom(text)) % max;

	return index;
}
