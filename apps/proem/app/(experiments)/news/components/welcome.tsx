import { PlusCircle } from "@untitled-ui/icons-react";

export function Welcome() {
	return (
		<div className="flex flex-col items-center justify-end rounded-t-[20px] space-y-8 py-8 pt-32 px-3 bg-gradient-to-b from-[#7DFA86] from-[0%] via-[#5950EC21] via-[28%] to-transparent to-[60%]">
			<div className="flex flex-col items-center justify-center gap-2 w-4/5">
				<p className="font-semibold text-white text-xl text-center leading-7">
					We take any news article and enrich it with scientific insights from
					the latest research papers.
				</p>
			</div>

			<div className="flex w-4/5 h-[52px] items-center justify-center gap-2">
				<button
					type="button"
					className="flex w-80 items-center gap-2.5 p-4 rounded-full border border-white/80 hover:pointer"
				>
					<PlusCircle className="text-[#f6f5e8] hsize-6 block hover:animate-[spin_1s_ease-in-out] cursor-pointer" />

					<input
						type="text"
						placeholder="Enter url"
						className="font-normal text-white/50 text-sm leading-[14px] bg-transparent border-none outline-none w-full"
					/>
				</button>
			</div>

			<div className="inline-flex items-center gap-1.5">
				<div className="font-semibold text-white/60 text-sm text-center leading-[14px] underline hover:pointer">
					Dismiss
				</div>
			</div>
		</div>
	);
}
