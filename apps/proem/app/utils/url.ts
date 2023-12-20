export function getLocation() {
  const isBrowser = () => typeof window !== "undefined";
  const location =
    isBrowser() && window.location.pathname + window.location.search;

  return location ? location : "https://proemial.ai";
}
