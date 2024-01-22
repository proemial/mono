import { OpenAlexConcept } from "@proemial/models/open-alex";

export const onlyDeepLevelConcepts = (
  concepts: OpenAlexConcept[]
): OpenAlexConcept[] => {
  const nonTopLevelConcepts = concepts.filter((concept) => concept.level > 0);
  const deepestLevel = Math.max(
    ...nonTopLevelConcepts.map((concepts) => concepts.level)
  );
  return nonTopLevelConcepts.filter((concept) =>
    [deepestLevel, deepestLevel - 1].includes(concept.level)
  );
};
