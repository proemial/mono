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

## Example queries
- http://127.0.0.1:4242/discover/fingerprints?ids=W4385245566%2CW2023427658%2CW2321180122%2CW1965689737%2CW1544790838
- http://127.0.0.1:4242/discover?debug=true
- http://127.0.0.1:4242/discover/fingerprints?ids=W4385245566,W2023427658,W2321180122,W1971300598,W1965689737,W1544790838,W589686507,W2062461962,W646534937
- http://127.0.0.1:4242/discover/fingerprints?ids=W4385245566,W2023427658,W2321180122,W1971300598,W1965689737,W1544790838,W589686507,W2062461962,W646534937,W1775749144,W2100837269,W1981368803,W1979290264,W2131350133,W1517701247