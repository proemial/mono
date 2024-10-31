import { env } from "@/env/client";
import { NewsAnnotatorSteps } from "@proemial/adapters/redis/news2";

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
				"flex flex-col w-full h-full font-sans text-[48px] leading-[48px]",
			)}
			style={{
				backgroundImage: `url(${item.scrape?.artworkUrl})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundColor: "#474747", // Fallback color
			}}
		>
			<div {...twcl("flex flex-1")} />

			<div {...twcl("flex flex-1 items-end")}>
				<div {...twcl("flex w-1/2 mx-8 p-8 bg-white rounded-lg shadow-2xl")}>
					{truncatedQuestion}
					{questionIsTruncated && " ..."}
				</div>
			</div>

			<div {...twcl("flex flex-row flex-1 pl-16 pb-8 items-end")}>
				<div
					{...twcl(
						"w-[72px] h-[72px] p-4 bg-black rounded-full flex items-center justify-center",
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
						"flex flex-col flex-1 w-1/2 ml-16 mb-[-92px] p-8 bg-white rounded-lg shadow-2xl",
					)}
				>
					{truncatedAnswer}
					{answerIsTruncated && " ..."}
				</div>
				<div {...twcl("flex flex-1")} />
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
