# File structure

/apps/assistant
│── /src
│   │── /app
│   │   │── /api
│   │   │   │── /events
│   │   │   │   │── /(n8n)/outbound
│   │   │   │   │   │── route.ts
│   │   │   │   │── /(slack)
│   │   │   │   │   │── /inbound
│   │   │   │   │   │   │── route.ts
│   │   │   │   │   │   │── suggestions.ts
│   │   │   │   │   │── /oauth/[appid]
│   │   │   │   │   │   │── route.ts
│   │   │   │   │── routing.ts
│   │   │   │── /inngest
│   │   │   │   │── route.ts
│   │   │── /(pages)
│   │   │   │── /slack/welcome/[teamid]
│   │   │   |   │── page.tsx
│   │   /inngest
│   │   │── /workers
│   │   │   │── /annotate
│   │   │   │   │── scrape.task.ts
│   │   │   │   │── summarize.task.ts
│   │   │   │── /ask
│   │   │   │   │── answer.task.ts
│   │   │   │   │── suggestions.task.ts
│   │   │   │── /routing
│   │   │   │   │── n8n.task.ts
│   │   │   │   │── slack.task.ts
│   │   │   │── index.ts
│   │   │── client.ts
│   │   │── router.ts
│   │   /prompts
│   │   │── annotate.prompt.ts
│   │   │── ask.prompt.ts
│   │   │── followups.prompt.ts
/packages/adapters
│── /ai/openai
│   │── summarize.adapter.ts
│   │── chat.adapter.ts
│── /inngest
│   │── inngest.adapter.ts
│── /mongo/brain
│   │── {collection}.adapter.ts
│── /n8n
│   │── n8n.adapter.ts
│── /scraping
│   │── diffbot.adapter.ts
│   │── youtube.adapter.ts
│── /slack
│   │── channel.adapter.ts
│   │── thread.adapter.ts
│   │── user.adapter.ts
