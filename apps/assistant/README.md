## Steps
- Ask @brian to add slackbot to mongoDB
- `git pull`
- `pnpm i`
- `pnpm run vercel-pull-env` 
- Run following processes in separate tabs in terminal:
	- `pnpm --filter assistant run dev`
	- `npx inngest-cli@latest dev --no-discovery -u http://127.0.0.1:6262/api/inngest`
	- `ngrok http 6262 --url https://externally-emerging-hermit.ngrok-free.app` (create a user to set a fixed domain https://dashboard.ngrok.com/domains)
- Send ngrok domain to @brian so he can add it to slackbot
	- Alternatively get @brian to add you as collaborator on app and change domain here https://api.slack.com/apps/
	  ![screenshot](https://u.lillefar.dk/i/VT0U5k+)
- Now add slackbot to a channel og DM it the use your local dev bot


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
