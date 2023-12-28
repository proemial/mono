export function now() {
  return new Date().getTime();
}

export function logMetric(key: string, begin: number) {
  const elapsed = now() - begin;
  console.log(`[${elapsed}] ${key}`);
}

export function logError(key: string, begin: number, e: unknown) {
  console.error(key, e);
  logMetric(key, begin);
}

