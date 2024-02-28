# Proem monorepo

This monorepo is based on turborepo.

## Getting started

This guide describes how to setup and use a GitHub Codespace. 

Developers are assumed to be capable of up their own local development environment, including the installation of `turborepo`, `node`, `pnpm` and the `vercel cli`.

### Initial setup up of a GitHub Codespace
> All commands should be executed from the root directory, in a terminal, inside the codespaces development environment.

1. Create a codespace using the shortcut in the upper right corner of GitHub. This should eventually bring up an online development environment.
![Alt text](<screenshots/CleanShot 2024-02-27 at 15.13.23@2x.png>)
![Alt text](<screenshots/CleanShot 2024-02-27 at 15.14.24@2x.png>)

1. Install the suggested plugins when prompted
![alt text](<screenshots/CleanShot 2024-02-27 at 16.21.43@2x.png>)

1. Install prerequisite cli's
    - `npm i -g turbo vercel`

1. Link to vercel:
    - login with your GitHub user: `vercel login`
    - link the repository: `vercel link --repo` *(scope: Proemial, projects: all)*

1. Pull enviroment variables by running `pnpm run vercel-pull-env`

1. Install dependencies by running `pnpm i`

1. Start a development server using `turbo dev` and open the port `4242` url mapping

1. Shut down the codespace using the bottom blue button

> To reopen the codespace, got to https://github.com/codespaces and start it. There is an hourly fee for running it, so remember to shut it down whenever your done. (shuts down automatically after 30 minutes)

### Setting up the IDE

You can run everything from the browser, but code formatting seems to be broken.

You should instead install Visual Studio Code locally, and the GitHub Codespaces plugin.

Finish off by opening the settings and set the default formatter
![alt text](<screenshots/CleanShot 2024-02-27 at 16.23.01@2x.png>)

## Working with the code

### Daily routine

- You can either open VS Code and connect to the codespace or open VS Code from https://github.com/codespaces
- When running on main, always start by pulling the latest changes from the **Source Control** tab 
- Run the development server using `turbo dev` and open the suggested url
- You usually do not need to refresh the browser, changes are automatically reflected in the browser
- You may need to run `pnpm i` when `packages.json` is changed, or `pnpm run vercel-pull-env` if new environment variables are introduced
- You may also want to work on a branch, to avoid conflict handling

## Code structure

### Apps and Packages

- `apps/proem`: The main app
- `apps/search`: The search api, used by ChatGPT
- `apps/website`: The website for proemial.ai
- `packages/*`: Code and configuration shared between apps

## The file structure
Pages and components are placed under `apps/proem/app`, following the [app router](https://nextjs.org/docs/app/building-your-application/routing) file structure.

* The main pages are in the sub folder `(app)/(pages)`
* Any `page.tsx` is a main page
* Any `layout.tsx` is part of the hierachical layout files
* The url follow the folder structure
* Folder names in `()` is organisational only, and not reflected in the url
* Folder names in `[]` contains a variable argument, such as an OpenAlex ID
* Global styling is in `globals.css` and `tailwind.config.js`
* Most styling is inline though, decalred using [Tailwind CSS](https://tailwindcss.com/)
