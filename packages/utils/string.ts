export function fromInvertedIndex(index: { [key: string]: number[] }) {
  const tokens = [] as string[];

  // @ts-ignore
  Object.keys(index).forEach((k) => index[k].forEach((a) => (tokens[a] = k)));

  return tokens.join(" ");
}
