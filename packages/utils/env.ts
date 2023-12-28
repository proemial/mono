export const Env = {
  get: (key: string): string => {
    if (!process.env[key])
      throw new Error(
        `Missing env key '${key}', run 'pnpm run vercel-pull-env'`,
      );

    return process.env[key] as string;
  },
};
