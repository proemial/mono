# Proem monorepo

This monorepo is based on turborepo.

## Getting started

This guide describes setting up a GitHub Codespace. 

Developers are assumed to have the neccesary skills to set up their own local development environment. This includes installation of `turborepo`, `node`, `pnpm` and the `vercel cli`.

### Setting up the development environment
> All commands should be executed from the root.

1. Create a codespace using the shortcut in the upper right corner of GitHub. This should eventually bring up an online development environment.
![Alt text](<screenshots/CleanShot 2024-02-27 at 15.13.23@2x.png>)
![Alt text](<screenshots/CleanShot 2024-02-27 at 15.14.24@2x.png>)

1. Install the suggested plugins when prompted

1. Install prerequisites
    - `npm install turbo --global`
    - `npm i -g vercel`

1. ~~Link to vercel~~
    - ~~cd into `/apps/proem` and run `vercel link`~~
    - ~~Click the login url and copy the code~~
    - ~~Paste it into your terminal and press enter~~
    - ~~Complete the wizard, setting the scope to `Proemial` and accepting to link to an existing app~~

1. Link to vercel:
      - install cli: `pnpm i -g vercel`
    - login with your user: `vercel login`
    - link the repository: `vercel link --repo`

1. Pull enviroment variables by running `pnpm run vercel-pull-env`

1. Install dependencies by running `pnpm i`

1. Start a development server using `turbo dev` and open the suggessted url

## Working with the code

### Daily routine
TODO: 
- start and stop codespace plus development server
- pull changes
- Pull env and install dependencies
- branching

## Code structure

### Apps and Packages

- `apps/proem`: The main app
- `apps/search`: The search api, used by ChatGPT
- `apps/website`: The website for proemial.ai
- `packages/*`: Code and configuration shared between apps

## TODO: The router structure
