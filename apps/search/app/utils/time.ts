export const Log = {
  metrics: (begin: number, message: string) => {
    console.log(`[${Time.elapsed(begin)}] ${message}`);
  },
};

export const Time = {
  now: () => new Date().getTime(),
  elapsed: (begin: number) => Time.now() - begin,
};
