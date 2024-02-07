/**
 * Prettifies a random slug based on the user's question.
 * @example prettySlug("Hello World") //> "hello-world-<randomID>"
 */
export function prettySlug(question: string) {
  return `${encodeURI(question.replaceAll(" ", "-")).substring(0, 12)}-${crypto
    .randomUUID()
    .replaceAll("-", "")
    .substring(0, 22)}`;
}
