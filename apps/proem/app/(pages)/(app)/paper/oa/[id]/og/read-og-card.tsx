import { OpenAlexPaper } from "@proemial/models/open-alex";
import { File02, Calendar } from "@untitled-ui/icons-react";

type AnswerSharingCardProps = {
	paper: OpenAlexPaper;
	/**
	 * Uses experimental tw to work both in app and with @vercel/og
	 */
	classNameAttr?: "className" | "tw";
};

function truncate(str: string, maxLength = 120) {
	return str.length <= maxLength
		? str
		: `${
				str.substring(0, maxLength) + str?.substring(maxLength).split(" ")[0]
			}`;
}

function sanitizeTitle(title: string) {
	let truncated = truncate(title);
	const isTruncated = truncated !== title;
	truncated = truncated.replace(/^"|"$/g, "");

	return [truncated, isTruncated];
}

function sanitizeSource(source: string) {
	if (!source) return undefined;

	let truncated = truncate(source.replace(/[\u{0080}-\u{FFFF}]/gu, ""), 40);
	const isTruncated = truncated !== source;
	truncated = !isTruncated ? truncated : `${truncated} ...`;

	return truncated;
}

export function ReadOpenGraphCard({
	paper,
	classNameAttr = "className",
}: AnswerSharingCardProps) {
	const twcl = (tailwindClasses: string) => ({
		[classNameAttr]: tailwindClasses,
	});

	const title = paper.generated?.title ?? paper.data.title;
	const [truncatedTitle, titleIsTruncated] = sanitizeTitle(title);

	const svgProps = { height: "42px", width: "42px" };

	const metadata = [
		{
			icon: <File02 {...svgProps} />,
			label: sanitizeSource(
				paper.data.primary_location?.source?.host_organization_name,
			),
		},
		{
			icon: <File02 {...svgProps} />,
			label: sanitizeSource(paper.data.primary_location?.source?.display_name),
		},
		{
			icon: <Calendar {...svgProps} />,
			label: paper.data.publication_date,
		},
	].filter((m) => !!m.label);

	return (
		<div
			{...twcl(
				"flex flex-col bg-[#474747] w-full h-full text-white font-sans px-[62px] py-[46px]",
			)}
		>
			<div {...twcl("flex flex-col flex-1")}>
				<div {...twcl("flex flex-col text-[66px] leading-[82px]")}>
					{truncatedTitle}
					{titleIsTruncated && " ..."}
				</div>
			</div>

			<div {...twcl("flex justify-between items-end")}>
				<div {...twcl("flex flex-col -mt-3 items-begin text-[42px]")}>
					<div {...twcl("flex")}>
						<div {...twcl("flex mr-4 mt-2")}>{metadata.at(0)?.icon}</div>
						<div {...twcl("flex items-begin justify-begin")}>
							{metadata.at(0)?.label}
						</div>
					</div>
					{metadata.at(1) && (
						<div {...twcl("flex")}>
							<div {...twcl("flex mr-4 mt-2")}>{metadata.at(0)?.icon}</div>
							<div {...twcl("flex items-begin justify-begin")}>
								{metadata.at(1)?.label}
							</div>
						</div>
					)}
				</div>
				<img
					{...twcl("w-[42px]")}
					src={`${process.env.NEXT_PUBLIC_VERCEL_URL}/open-graph/logo.svg`}
					alt=""
				/>
			</div>
		</div>
	);
}
