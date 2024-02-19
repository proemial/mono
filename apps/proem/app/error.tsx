"use client"; // Error components must be Client Components

import GlobalError from "@/app/global-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Wrapping GlobalError as I somehow cannot get the default sentry setup to work
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#react-render-errors-in-app-router
  return <GlobalError error={error} reset={reset} />;
}
