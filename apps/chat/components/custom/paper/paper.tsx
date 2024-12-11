import { Button } from "@proemial/shadcn-ui";
import { formatDate } from "@proemial/utils/date";
import { File06, LinkExternal02, Stars02 } from "@untitled-ui/icons-react";
import { Markdown } from "../markdown";
import { useQuery } from "@tanstack/react-query";
import { AnnotatedPaper } from "@/app/(chat)/api/paper/[id]/route";

type PaperResponse = {
	done: boolean;
	data: AnnotatedPaper;
};

export default function ResearchPaper({ id }: { id: string }) {
	const { data: response, isLoading } = usePaper(id);
	const data = response?.data;
	const publisher = data?.paper?.primary_location?.source?.display_name;

	return (
		<div className="">
			{isLoading ? (
				<div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
					<File06 className="w-20 h-20 text-foreground/20 animate-pulse motion-safe:animate-[bounce_2s_ease-in-out_infinite]" />
				</div>
			) : (
				<div>
					<div className="flex flex-col gap-2 items-start p-4 sm:mx-auto rounded-lg bg-blue-500/10 dark:bg-blue-500/20 leading-normal">
						<div className="font-light text-sm md:text-base">
							<Stars02 className="inline-block mr-2 size-4 top-[-1px] relative" />
							summary
						</div>
						<div className="text-lg font-semibold">
							<Markdown>{data?.generated?.title ?? ""}</Markdown>
						</div>
						<div className="text">
							{(() => {
								const isMobile =
									typeof window !== "undefined" && window.innerWidth < 640;

								if (!isMobile)
									return (
										<Markdown>{data?.generated?.description ?? ""}</Markdown>
									);

								return (
									<>
										{data?.generated?.description?.slice(0, 200)}...{" "}
										<a
											href="#"
											className="font-normal cursor-pointer"
											onClick={(e) => {
												e.preventDefault();
												const element = document.querySelector(".text");
												if (element) {
													element.textContent =
														data?.generated?.description || "";
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
						{publisher && (
							<a
								href={data?.paper?.primary_location?.landing_page_url}
								target="_blank"
								rel="noreferrer"
								className="hover:underline hover:text-foreground no-underline font-light transition text-muted-foreground truncate max-w-[80%]"
							>
								{publisher}
							</a>
						)}
						<div className="flex-shrink-0">
							{formatDate(data?.paper?.publication_date, "relative")}
						</div>
					</div>
					<div className="font-semibold text-2xl md:text-3xl mt-2 mb-2">
						<Markdown>{data?.paper?.title ?? ""}</Markdown>
					</div>

					<div className="text-sm md:text-base font-light text-muted-foreground mb-1">
						Written by{" "}
						{data?.paper?.authorships
							?.map((author) => author.author.display_name)
							.join(", ")}
					</div>

					<div className="mt-4">
						{data?.paper?.abstract ? (
							<Markdown>{data.paper?.abstract}</Markdown>
						) : (
							"Abstract not found"
						)}
					</div>

					{data && (
						<div className="flex items-center justify-center w-full my-8">
							<a
								href={data?.paper?.primary_location?.landing_page_url}
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

function usePaper(id: string) {
	return useQuery<PaperResponse, Error, PaperResponse>({
		queryKey: ["paper", id],
		queryFn: async (): Promise<PaperResponse> => {
			const response = await fetch(`/api/paper/${id}`);
			const data = await response.json();

			if (response.status === 202) {
				return { done: false, data };
			}
			if (response.status === 200) {
				return { done: true, data };
			}

			throw new Error(`Unexpected status: ${response.status}`);
		},
		refetchInterval: (query) => {
			if (query.state.data?.done || query.state.error) {
				return false;
			}
			return 10;
		},
		retry: 3,
	});
}
