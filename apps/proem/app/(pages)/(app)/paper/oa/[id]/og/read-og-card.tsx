import { AlignLeft } from "@/components/icons/AlignLeft";
import {
	File02,
	ChevronDown,
	ChevronSelectorVertical,
} from "@untitled-ui/icons-react";

type AnswerSharingCardProps = {
	title: string;
	abstract: string;
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

export function ReadOpenGraphCard({
	title,
	abstract,
	classNameAttr = "className",
}: AnswerSharingCardProps) {
	const twcl = (tailwindClasses: string) => ({
		[classNameAttr]: tailwindClasses,
	});

	const truncated = truncate(abstract);
	const isTruncated = truncated !== abstract;

	const svgProps = { height: "26px", width: "26px" };

	return (
		<div
			{...twcl(
				"flex flex-col bg-[#000000] w-full h-full text-white font-sans p-[62px] pt-[78px]",
			)}
		>
			<div {...twcl("flex flex-col flex-1 text-[24px]")}>
				<div {...twcl("flex justify-between")}>
					<div {...twcl("flex items-center")}>
						<div {...twcl("flex mr-4")}>
							<File02 {...svgProps} />
						</div>
						Research paper
					</div>
					<div {...twcl("flex")}>
						<ChevronDown {...svgProps} />
					</div>
				</div>

				<div {...twcl("flex mt-8 justify-between")}>
					<div {...twcl("flex items-center")}>
						<div {...twcl("flex mr-4")}>
							<AlignLeft width={24} height={18} />
						</div>
						Summary
					</div>
					<div {...twcl("flex items-center")}>
						GPT-4o
						<ChevronSelectorVertical {...svgProps} />
					</div>
				</div>

				<div {...twcl("flex flex-col mt-4 text-[44px] leading-[56px]")}>
					{title}
					<div {...twcl("flex flex-col mt-4 text-[22px] leading-[33px]")}>
						{truncated}
						{isTruncated && " ..."}
					</div>
				</div>
			</div>

			<div {...twcl("flex justify-end")}>
				<img
					{...twcl("w-[42px]")}
					src={`${process.env.NEXT_PUBLIC_VERCEL_URL}/open-graph/logo.svg`}
					alt=""
				/>
			</div>
		</div>
	);
}
