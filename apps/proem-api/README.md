This is a our API for Slack and nexus

## Slack
The slack api consists of an event broker and a set of helper APIs.

### Event Broker
* The event broker logs events received from slack at `/api/slack/events/inbound` to a mongodb collection and forwards them to `n8n`.
* It exposes a `/api/slack/events/outbound` endpoint for `n8n` to send events to, which are similar logged to the mongodb collection and forwarded to slack.

### Helper APIs
The helper APIs are a set of APIs that provide helper functions for the slack app.

* `/api/slack/helpers/history?channelId=...&teamId=...`
Returns the latest 100 messages from a slack channel.
* `/api/slack/helpers/history/summarise?channelId=...&teamId=...`
Returns a single paragraph summary of the latest 100 messages from a slack channel.
* `/api/slack/helpers/scrape`
Scrapes a url and returns the content. The content is stored in mongodb to speed up future requests.

### Local development
* Run an ngrok tunnel to expose your local server on the internet.
* Create a Slack app called `dev-$yourname` with the follwoing properties:
    - **Basic Information**
        - App ID: `$APP_ID`
        - Client ID: `$CLIENT_ID`
        - Client Secret: `$CLIENT_SECRET`
        - App icon & Preview: __Logo__
    - **Interactivity & Shortcuts**
        - Request URL:  `$NGROK_URL/slack/events/inbound`
    - **OAuth & Permissions**
        - Redirect URL: `https://api.proem.ai/slack/oauth/$APP_ID`
        - Scopes:
            - app_mentions:read
            - channels:history
            - chat:write
    - **Event Subscriptions:**
        - Request URL:  `$NGROK_URL/slack/events/inbound`
        - Subscribe to bot events:
            - app_mentions
            - message.channels
    - **Manage Distribution**
        - Activate Public Distribution
* Create a mongodb object in the entities collection:
    ```
    {
        "type": "app",
        "id": "$APP_ID",
        "name": "Proem Dev",
        "metadata": {
            "clientId": "$CLIENT_ID",
            "clientSecret": "$CLIENT_SECRET",
            "callback": "$NGROK_URL"
        },
        "createdAt": {
            "$date": "2025-01-30T12:49:03.670Z"
        }
    }
    ```
* Add the Slack app to a slack channel using the install url

## Nexus
*TODO*
