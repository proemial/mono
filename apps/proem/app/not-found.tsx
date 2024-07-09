"use client";
import { routes } from "@/routes";
import { buttonVariants } from "@proemial/shadcn-ui";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex mt-[25%]">
			<div className="rounded-sm border border-background flex flex-col py-4 px-4 items-left m-auto">
				<h1 className="text-[24px] font-normal leading-[32px]">Not found</h1>
				<p className="leading-snug text-[14px] font-normal text-left">
					The content you are looking for could not be found, or you do not have
					sufficient permissions to access it.
				</p>
				<div className="flex mt-10 gap-x-2">
					<Link
						href={routes.space}
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
