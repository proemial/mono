# proem

## Vercel link, neon DB & local workflow

Vercel's Neon integration builds a new branch of the database for each new branch in git.
Currently `apps/proem` is the only Vercel project configure with the [https://vercel.com/integrations/neon](Neon Postgres Ingtegration).
New connections strings is then added in Vercel and can be pulled local as follows:

Every time you change branch the updated env vars can be fetched with: `pnpm run vercel-pull-env`.
(TODO!: this can be automated or simplified at a later point of deemed tedious)

### Git branches and corelating DB's

| Git branch name | Database name locally   | Database name on Vercel |
| --------------- | ----------------------- | ----------------------- |
| main            | main (production)       | vercel-dev (preview)    |
| [branch_name]   | [branch_name] (preview) | [branch_name] (preview) |

Because Vercel only have custom branches for the preview enviroment and the Neon integrations relies on that, we're currently running the exact same environment variables for both preview environment on Vercel & local development.
Note: Right after installing the integration the `DATABASE_URL` env vars is only set to "Development"."Preview" has been added manually.

## Answer Engine AI streaming

```mermaid
sequenceDiagram
    Client->> Server: Ask Question
    Server-->> Client: Push generated answer slug. 
		Server->> LLM: Find intent from Question
		Server->> LLM: Generate Search Params from Question
		LLM->> Server: Returns related & key concepts
    Server->>OpenAlex: Fetch papers based on AI generated query
		OpenAlex->>Server: Return 30 papers from Open Alex's search
		Server-->> Server: Filter papers based on Abstract
    Server->> LLM: Select relevant papers based on the users question
		LLM->> Server: Returns 2 most relevant papers
		Server->> Client: (if no papers) return an error early
		Server->> LLM: Generate answer by question, 2 papers & chat history  
    LLM->>Server: Stream answer
    Server->>Client: Stream answer
		Server-->> Client: Push shareId & runId
		Server->> LLM: Generate follow-up questions
    LLM->> Server: Return 2 follow-up questions
		Server-->> Client: Push follow-up questions    
```
