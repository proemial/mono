import { env } from "@/env/client";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news";

type AnswerSharingCardProps = {
	item: NewsAnnotatorSteps;
	// Uses experimental tw to work both in app and with @vercel/og
	classNameAttr?: "className" | "tw";
};

export function ReadOpenGraphCard({
	item,
	classNameAttr = "className",
}: AnswerSharingCardProps) {
	const twcl = (tailwindClasses: string) => ({
		[classNameAttr]: tailwindClasses,
	});

	const question = item.summarise?.questions.at(0)?.at(0) as string;
	const [truncatedQuestion, questionIsTruncated] = sanitizeQuestion(question);

	const answer = item.summarise?.questions.at(0)?.at(1) as string;
	const [truncatedAnswer, answerIsTruncated] = sanitizeQuestion(answer);

	return (
		<div
			{...twcl(
				"flex flex-col w-full h-full px-8 font-sans text-[40px] leading-[54px]",
			)}
			style={{
				backgroundImage: `url(${item.scrape?.artworkUrl})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundColor: "#474747", // Fallback color
			}}
		>
			<div {...twcl("flex flex-col h-full  justify-end")}>
				<div {...twcl("flex flex-grow flex-col")} />

				<div {...twcl("flex flex-row w-2/3 items-start")}>
					<div
						{...twcl(
							"w-[72px] h-[72px] p-4 mt-4 bg-black/90 rounded-full flex items-center justify-center shadow-2xl",
						)}
					>
						<div {...twcl("w-[24px] flex items-center justify-center")}>🤔</div>
					</div>
					<div
						{...twcl(
							"flex flex-col flex-1 w-20 ml-4 p-8 bg-white rounded-[48px] shadow-2xl",
						)}
					>
						{truncatedQuestion}
						{questionIsTruncated && " ..."}
					</div>
				</div>

				<div
					{...twcl("flex flex-row w-2/3 flex-1 pl-24 pb-8 mt-8 items-start")}
				>
					<div
						{...twcl(
							"w-[72px] h-[72px] p-4 mt-4 bg-black rounded-full flex items-center justify-center shadow-2xl",
						)}
					>
						<img
							{...twcl("w-[24px]")}
							src={`${env.NEXT_PUBLIC_VERCEL_URL}/open-graph/logo-green.svg`}
							alt=""
						/>
					</div>
					<div
						{...twcl(
							"flex flex-col flex-1 w-20 ml-4 p-8 bg-white rounded-[48px] shadow-2xl",
						)}
					>
						{truncatedAnswer}
						{answerIsTruncated && " ..."}
					</div>
				</div>
			</div>
		</div>
	);
}

function sanitizeQuestion(title: string) {
	let truncated = truncate(title);
	const isTruncated = truncated !== title;
	truncated = truncated.replace(/^"|"$/g, "");

	return [truncated, isTruncated];
}

function truncate(str: string, maxLength = 120) {
	return str.length <= maxLength
		? str
		: `${
				str.substring(0, maxLength) + str?.substring(maxLength).split(" ")[0]
			}`;
}
