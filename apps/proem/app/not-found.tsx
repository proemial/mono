"use client";
import { buttonVariants } from "@proemial/shadcn-ui";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex mt-[25%]">
			<div className="rounded-sm border border-background flex flex-col py-4 px-4 items-left m-auto">
				<h1 className="text-[24px] font-normal leading-[32px]">Page missing</h1>
				<p className="leading-snug text-[14px] font-normal text-left">
					Sorry, we are working on fixing this.
				</p>
				<div className="flex mt-10 gap-x-2">
					<Link
						href="/"
						className={buttonVariants({ variant: "default", size: "default" })}
					>
						Go to home
					</Link>
					<Link
						href="mailto:hi@proemial.ai?subject=I'd like to report an issue"
						className={buttonVariants({
							variant: "default",
							size: "default",
						})}
					>
						Report to support
					</Link>
				</div>
			</div>
		</main>
	);
}
