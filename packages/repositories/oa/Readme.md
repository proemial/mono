# OpenAlex filters

- Filter nodes can be `AND`'ed together by using `comma` for separate nodes, and `plus` within the same node:
    - Must have topic domain `3` AND topic field `22`: https://api.openalex.org/works?filter=topics.domain.id:3,topics.field.id:22
    - Must have topic field `17` AND topic field `22`:
        - https://api.openalex.org/works?filter=topics.field.id:17+22 or
        - https://api.openalex.org/works?filter=topics.field.id:17,topics.field.id:22
- Filter nodes can be `OR`'ed within the same node using `pipe`, but cannot be OR'ed on separate nodes:
    - Must have topic field `17` OR topic field `22`: https://api.openalex.org/works?filter=topics.field.id:17%7C22
    - Not possible: https://api.openalex.org/works?filter=topics.domain.id:3%7Ctopics.field.id:22
    - Also not possible: https://api.openalex.org/works?filter=(topics.domain.id:3%20OR%20topics.field.id:22)
- Searching inside text nodes can be done using `AND`/`OR`, with optional parenthesis for grouping:
    - Title must contain foo `OR` bar: https://api.openalex.org/works?filter=title.search:foo%20OR%20bar
    - Display name must contain either foo `AND` bar or baz: https://api.openalex.org/works?filter=display_name.search:((foo%20AND%20bar)%20OR%20baz)