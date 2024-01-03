export const Env = {
  get: (key: string): string => {
    if (!process.env[key]) fail(key);

    return process.env[key] as string;
  },

  validate: (key: string, value?: string): string => {
    if (!key || !value) fail(key);

    return value as string;
  },
};

function fail(key: string) {
  throw new Error(`Missing env key '${key}', run 'pnpm run vercel-pull-env'`);
}
