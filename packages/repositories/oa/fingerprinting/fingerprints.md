# Fingerprints

- A paper can be `fingerprinted`
    - A fingerprint is a list of `features`
    - A feature can be either a `topic`, `keyword` or `concept` from OpenAlex
    - Each feature has a `score` assigned by OpenAlex, which is it's relevancy to the paper
- Multiple fingerprints can be joined into a `feature filter`
    - A feature filter is a list of `ranked features`,  built from a list of fingerprints, fetched and extracted by a set of `paper ids`
    - The features in the feature filter is ranked by the assignment of `co-occurrence scores`, based on their original score combined with other occurrences of the same feature in other fingerprints
    - Features in the feature filter can be marked as `irrelevant`, if their co-occurrence score is too low
    - The feature filter can be further modified by an optional set of `reading stats`, consisting of `last read` and `times read` by the user
- Papers are fetched with an under-constrained `OR` query, and re-ranked based on the feature filter
    - We calculate a `feature match score` for matching features in the paper, by multiplying its score with the co-occurrence score from the feature filter 
    - Papers can then be ordered (and possibly filtered) by a `filter match score`, which is the sum of feature match scores of all features in the paper
    - A more advanced re-ranking method can be introduced once needed