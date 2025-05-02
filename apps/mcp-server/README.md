# Gettings Started

## Starting the Server

```shell
pnpm --filter mcp-server run dev
```

## Manually Testing the Server

Uses a CLI MCP client.

```shell
pnpm --filter mcp-server run test
```

Try these commands to test tools/resources/prompts:

```shell
list-tools
call-tool search-papers {"query":"foo bar baz"}
```

## Deploying the Server to Cloudflare

```shell
pnpm --filter mcp-server run auth
pnpm --filter mcp-server run deploy
```

## Testing the Server on Cloudflare

```shell
pnpm --filter mcp-server run test
```

Disconnect from any `localhost` server. Then, connect to the remote server
(notice the trailing `/mcp` in the worker URL below):

```shell
connect https://mcp-server.proemial.workers.dev/mcp
list-tools
call-tool search-papers {"query":"foo bar baz"}
```
