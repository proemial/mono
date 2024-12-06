import { useObject } from "@/lib/use-object";
import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { Button } from "@proemial/shadcn-ui";
import { formatDate } from "@proemial/utils/date";
import { File06, LinkExternal02, Stars02 } from "@untitled-ui/icons-react";

type StreamedPaper = {
	data: OpenAlexPaperWithAbstract;
	generated?: {
		title?: string;
		description?: string;
	};
};

export function ResearchPaper({ id }: { id: string }) {
	const { data: paper, isLoading } = useObject<StreamedPaper>(
		`/api/paper/${id}`,
	);
	const publisher = paper?.data?.primary_location?.source?.display_name;

	return (
		<div className="">
			{isLoading ? (
				<div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
					<File06 className="w-20 h-20 text-foreground/20 animate-pulse motion-safe:animate-[bounce_2s_ease-in-out_infinite]" />
				</div>
			) : (
				<div>
					<div className="flex flex-col gap-2 items-start p-4 -mx-4 sm:mx-auto sm:rounded-lg bg-blue-500/10">
						<div className="font-light text-sm md:text-base">
							<Stars02 className="inline-block mr-2 size-4 top-[-1px] relative" />
							summary
						</div>
						<div className="text-lg font-semibold">
							{paper?.generated?.title}
						</div>
						<div className="text">
							{(() => {
								const isMobile =
									typeof window !== "undefined" && window.innerWidth < 640;

								if (!isMobile) return paper?.generated?.description;

								return (
									<>
										{paper?.generated?.description?.slice(0, 200)}...{" "}
										<a
											href="#"
											className="text-blue-500 hover:underline cursor-pointer"
											onClick={(e) => {
												e.preventDefault();
												const element = document.querySelector(".text");
												if (element) {
													element.textContent =
														paper?.generated?.description || "";
												}
											}}
										>
											Read more
										</a>
									</>
								);
							})()}
						</div>
					</div>
					<div className="flex justify-between text-muted-foreground mt-8 font-light text-sm md:text-base">
						<div>
							{publisher && (
								<a
									href={paper?.data?.primary_location?.landing_page_url}
									target="_blank"
									rel="noreferrer"
									className="hover:underline hover:text-foreground no-underline font-light transition text-muted-foreground"
								>
									{publisher}
								</a>
							)}
						</div>
						<div>{formatDate(paper?.data?.publication_date, "relative")}</div>
					</div>
					<div className="font-semibold text-2xl md:text-3xl mt-2 mb-2">
						{paper?.data?.title}
					</div>

					<div className="text-sm md:text-base font-light text-muted-foreground mb-1">
						Written by{" "}
						{paper?.data?.authorships
							?.map((author) => author.author.display_name)
							.join(", ")}
					</div>

					<div className="md:text-lg mt-4">
						{paper?.data?.abstract || "Abstract not found"}
					</div>

					{paper && (
						<div className="flex items-center justify-center w-full my-8">
							<a
								href={paper?.data?.primary_location?.landing_page_url}
								target="_blank"
								rel="noreferrer"
							>
								<Button
									variant="ghost"
									className="gap-2 hover:bg-muted-foreground/20"
								>
									<span>View full article</span>{" "}
									<LinkExternal02 className="size-4" />
								</Button>
							</a>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
