type AnswerSharingCardProps = {
	content: string;
	/**
	 * Uses experimental tw to work both in app and with @vercel/og
	 */
	classNameAttr?: "className" | "tw";
};

const maxLength = 270;

export function AnswerSharingCard({
	content,
	classNameAttr = "className",
}: AnswerSharingCardProps) {
	const twcl = (tailwindClasses: string) => ({
		[classNameAttr]: tailwindClasses,
	});

	const truncate = (str: string) => str.length <= maxLength ? str : `${str.substring(0, maxLength) + str?.substring(maxLength).split(" ")[0]}`;
	const truncated = truncate(content);

	return (
		<div
			{...twcl("flex flex-col p-12 bg-[#262626] w-full h-full text-white font-sans")}
		>
			<div {...twcl("flex flex-col flex-1 mt-2 mb-12")}>
				<div {...twcl("flex flex-wrap line-clamp-3 text-[40px] leading-1.6 p-8 bg-[#474747] rounded-t-[32px] rounded-br-[32px]")}>
					{truncated}{truncated !== content && " ..."}
				</div>
				<img
					{...twcl("w-[74px] h-[46px]")}
					src="http://localhost:4242/open-graph/corner.png"
					alt=""
				/>
			</div>

			<div {...twcl("flex items-center")}>
				<img
					{...twcl("w-14 h-20 mr-8 mt-2")}
					src="http://localhost:4242/open-graph/logo.svg"
					alt=""
				/>
				<div {...twcl("flex flex-col justify-between text-[32px] w-full text-[40px]")}>
					<div {...twcl(" pt-1")}>Answers backed by Science Research</div>
					<div {...twcl("text-white/50 pt-1")}>proem.ai</div>
				</div>
			</div>
		</div>
	);
}
