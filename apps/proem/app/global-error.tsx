"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button, buttonVariants } from "@/app/components/proem-ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="bg-[#2F2F2F] rounded-sm border border-[#3C3C3C] flex flex-col py-4 px-4 items-left m-auto">
      <h2 className="text-[24px] font-normal leading-[32px]">
        Something went wrong
      </h2>
      <Button
        className={buttonVariants({ variant: "primary", size: "default" })}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
