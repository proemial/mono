export function extractHostName(url: string) {
  const host = new URL(url).hostname.split(".");
  const tld = host.slice(-2).join("."); // e.g., "co.uk" or "com"
  const domainIndex = tld.includes("co.") ? -3 : -2;
  const domain = host.at(domainIndex) || host.at(-2); // fallback to second-to-last if no third-to-last exists

  return tld.includes("co.") ? `${domain}.${tld}` : `${domain}.${host.at(-1)}`;
}
