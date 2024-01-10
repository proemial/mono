# Proem monorepo

This monorepo is based on turborepo.

## Requirements

The latest LTS releases of:

- node & pnpm

### Apps and Packages

- `apps/proem`: The main app
- `apps/search`: The search api, used by ChatGPT
- `apps/website`: The website for proemial.ai
- `packages/data`: Helpers for accessing various api's
- `packages/models`: Shared models
- `packages/utils`: Pure TS utilities
- `packages/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Getting started

1. To interact with the (Vercel)[https://vercel.com/docs/cli] run the following commands from the repository root:
   1.1. install cli: `pnpm i -g vercel`
   1.2. login with your user: `vercel login`
   1.3. link the repository: `vercel link --repo`

2. Install dependencies: `pnpm i`
3. To develop all apps and packages, run the following command from the repository root: `pnpm dev` or filter to application like `pnpm dev --filter proem`

### Build

To build all apps and packages, run the following command from the repository root:

```
pnpm build
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
