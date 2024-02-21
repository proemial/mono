import { buttonVariants } from "@/app/components/proem-ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex mt-[25%]">
			<div className="bg-[#2F2F2F] rounded-sm border border-[#3C3C3C] flex flex-col py-4 px-4 items-left m-auto">
				<h1 className="text-[24px] font-normal leading-[32px]">Page missing</h1>
				<p className="leading-snug text-[14px] font-normal text-left">
					Sorry, we are working on fixing this.
				</p>
				<div className="flex mt-10 gap-x-2">
					<Link
						href="/"
						className={buttonVariants({ variant: "primary", size: "default" })}
					>
						Go to home
					</Link>
					<Link
						href="mailto:hi@proemial.ai?subject=I'd like to report an issue"
						className={buttonVariants({
							variant: "secondary",
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
