# Proem monorepo

This monorepo is based on turborepo.

## Requirements

The latest LTS releases of:
* node & pnpm
* A `.env.local` file in the `/apps/proem` directory, containing the following keys:
```
SENTRY_URL=
AUTH0_SECRET=
AUTH0_ISSUER_BASE_URL=https://proem.eu.auth0.com
AUTH0_BASE_URL=http://127.0.0.1/
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SCOPE=openid profile read:shows
AUTH0_AUDIENCE=https://proem.eu.auth0.com/api/v2/
```

## What's inside?

### Apps and Packages

- `proem`: The main app
- `search`: The search api, used by ChatGPT
- `packages/data`: Helpers for accessing various api's
- `packages/models`: Shared models
- `packages/utils`: Pure TS utilities 
- `packages/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Install

To install all dependencies, run the following command from the repository root:

```
pnpm i
```

### Build

To build all apps and packages, run the following command from the repository root:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command from the repository root:

```
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
