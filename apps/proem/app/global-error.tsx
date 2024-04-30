"use client";
import { Button, buttonVariants } from "@proemial/shadcn-ui";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.log(error);
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className="rounded-sm border border-foreground flex flex-col py-4 px-4 items-left m-auto">
			<h2 className="text-[24px] font-normal leading-[32px]">
				Something went wrong
			</h2>
			<Button
				className={buttonVariants({ variant: "default", size: "default" })}
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
