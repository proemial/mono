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
