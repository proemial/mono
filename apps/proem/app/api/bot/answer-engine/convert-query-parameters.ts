export function convertToOASearchString() {
  const query =
    "title.search:(%22vaccines%22),abstract.search:(%22vaccines%22%20OR%20%22immunization%22%20OR%22vaccination%22%20OR%20%22cause%22%20OR%20%22lead%20to%22%20OR%20%22Autism%20Spectrum%20Disorder%22%20OR%20%22ASD%22)";
  return query;
}
