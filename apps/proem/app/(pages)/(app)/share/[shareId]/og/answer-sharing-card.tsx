import { env } from "@/env/client";

type AnswerSharingCardProps = {
	content: string;
	/**
	 * Uses experimental tw to work both in app and with @vercel/og
	 */
	classNameAttr?: "className" | "tw";
};

const maxLength = 246;
const truncate = (str: string) =>
	str.length <= maxLength
		? str
		: `${
				str.substring(0, maxLength) + str?.substring(maxLength).split(" ")[0]
			}`;

export function AnswerSharingCard({
	content,
	classNameAttr = "className",
}: AnswerSharingCardProps) {
	const twcl = (tailwindClasses: string) => ({
		[classNameAttr]: tailwindClasses,
	});

	const truncated = truncate(content);
	const isTruncated = truncated !== content;

	return (
		<div
			{...twcl(
				"flex flex-col bg-[#262626] w-full h-full text-white font-sans p-[62px] pt-[78px]",
			)}
		>
			<div {...twcl("flex flex-col flex-1")}>
				<div
					{...twcl(
						"flex flex-wrap text-[44px] leading-[56px] bg-[#474747] rounded-t-[36px] rounded-br-[36px] px-9 pt-6 pb-8",
					)}
				>
					{truncated}
					{isTruncated && " ..."}
				</div>
				<img
					{...twcl("w-[50px]")}
					src={`${env.NEXT_PUBLIC_VERCEL_URL}/open-graph/corner.png`}
					alt=""
				/>
			</div>

			<div {...twcl("flex items-center")}>
				<img
					{...twcl("w-[42px] mr-12")}
					src={`${env.NEXT_PUBLIC_VERCEL_URL}/open-graph/logo.svg`}
					alt=""
				/>
				<div
					{...twcl(
						"flex flex-col justify-between leading-[40px] w-full text-[37px] -mt-1.5",
					)}
				>
					<div {...twcl("font-semibold")}>
						Answers backed by Science Research
					</div>
					<div {...twcl("text-white/50 font-normal")}>proem.ai</div>
				</div>
			</div>
		</div>
	);
}
