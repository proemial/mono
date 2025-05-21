"use client";
import { Button } from "@proemial/shadcn-ui";
import { formatDate } from "@proemial/utils/date";
import { LinkExternal02, Stars02 } from "@untitled-ui/icons-react";
import { Markdown } from "./markdown";
import { Throbber } from "./throbber";
import { QdrantPaper } from "../actions/search-action";
import { useState } from "react";

export default function ResearchPaper({
	paper,
	summary,
}: {
	paper: QdrantPaper;
	summary: string;
}) {
	return (
		<div className="">
			<div>
				<div className="flex flex-col gap-2 items-start p-4 sm:mx-auto rounded-lg bg-blue-500/10 dark:bg-blue-500/20 leading-normal">
					<div className="font-light text-sm md:text-base">
						<Stars02 className="inline-block mr-2 size-4 top-[-1px] relative" />
						summary
					</div>
					<div className="text-lg font-semibold">
						<Markdown>{summary}</Markdown>
					</div>
				</div>
				<div className="flex justify-between text-muted-foreground mt-8 font-light text-sm md:text-base">
					{paper.primary_location && (
						<a
							href={paper?.primary_location?.landing_page_url}
							target="_blank"
							rel="noreferrer"
							className="hover:underline hover:text-foreground no-underline font-light transition text-muted-foreground truncate max-w-[80%]"
						>
							{paper.primary_location.source.display_name ??
								paper.primary_location.source.host_organization_name ??
								paper.authorships?.at(0)?.author.institution ??
								paper.authorships?.at(0)?.author.display_name}
						</a>
					)}
					<div className="flex-shrink-0">
						{formatDate(paper.published, "relative")}
					</div>
				</div>
				<div className="font-semibold text-2xl md:text-3xl mt-2 mb-2">
					<Markdown>{paper.title}</Markdown>
				</div>

				<div className="text-sm md:text-base font-light text-muted-foreground mb-1">
					Written by{" "}
					{paper.authorships
						?.map((author) => author.author.display_name)
						.join(", ")}
				</div>

				<div className="mt-4">
					{paper.abstract ? (
						<div className="abstract">
							{(() => {
								// const isMobile =
								// 	typeof window !== "undefined" && window.innerWidth < 640;

								// if (!isMobile)
								// 	return <Markdown>{paper.abstract ?? ""}</Markdown>;

								return (
									<>
										{paper.abstract?.slice(0, 200)}...{" "}
										<a
											href="#"
											className="font-normal cursor-pointer"
											onClick={(e) => {
												e.preventDefault();
												const element = document.querySelector(".abstract");
												if (element) {
													element.textContent = paper.abstract || "";
												}
											}}
										>
											Read more
										</a>
									</>
								);
							})()}
						</div>
					) : (
						"Abstract not found"
					)}
				</div>

				{paper.primary_location && (
					<div className="flex items-center justify-center w-full my-8">
						<a
							href={paper?.primary_location?.landing_page_url}
							target="_blank"
							rel="noreferrer"
						>
							<Button
								variant="ghost"
								className="gap-2 hover:bg-muted-foreground/20"
							>
								View full article
								<LinkExternal02 className="ml-2 size-4 inline-block" />
							</Button>
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
