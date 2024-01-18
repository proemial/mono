import { convertToOASearchString } from "./convert-query-parameters";

it("can convert title and abstracts to OA friendly query format", () => {
  expect(
    convertToOASearchString("vaccines", [
      "vaccines",
      "immunization",
      "vaccination",
      "cause",
      "lead to",
      "Autism Spectrum Disorder",
      "ASD",
    ])
  ).toEqual(
    "title.search%3A(%22vaccines%22)%2Cabstract.search%3A(%22vaccines%22%20OR%20%22immunization%22%20OR%20%22vaccination%22%20OR%20%22cause%22%20OR%20%22lead%20to%22%20OR%20%22Autism%20Spectrum%20Disorder%22%20OR%20%22ASD%22)"
    // Original flawed string from GPT for reference
    // "title.search:(%22vaccines%22),abstract.search:(%22vaccines%22%20OR%20%22immunization%22%20OR%22vaccination%22%20OR%20%22cause%22%20OR%20%22lead%20to%22%20OR%20%22Autism%20Spectrum%20Disorder%22%20OR%20%22ASD%22)"
  );
});
