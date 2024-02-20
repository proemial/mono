import Link from "next/link";

export function RelatedPapers({ papers }: { papers: string[] }) {
	return (
		<>
			{papers?.length > 0 && (
				<div>
					<div>Related Papers</div>
					<div className="text-white/50 text-wrap">
						{papers.map((w) => (
							<span
								key={w}
								className="mr-1 border border-white/50 px-1 rounded-md"
							>
								<Link href={`/oa${w.substring(w.lastIndexOf("/"))}`}>
									{w.substring(w.lastIndexOf("/") + 1)}
								</Link>{" "}
							</span>
						))}
					</div>
				</div>
			)}
		</>
	);
}
