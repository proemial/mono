type AnswerSharingCardProps = {
	content?: React.ReactNode;
	/**
	 * Uses experimental tw to work both in app and with @vercel/og
	 */
	classNameAttr?: "className" | "tw";
};

export function AnswerSharingCard({
	content,
	classNameAttr = "className",
}: AnswerSharingCardProps) {
	const twcl = (tailwindClasses: string) => ({
		[classNameAttr]: tailwindClasses,
	});

	return (
		<div
			{...twcl(
				"flex flex-col px-8 pt-8 bg-[#333333] w-full h-full text-white font-sans",
			)}
		>
			<div {...twcl("flex")}>
				<img
					{...twcl("w-17 h-17 rounded-full")}
					src="https://proem.ai/android-chrome-512x512.png"
				/>
				<div {...twcl("flex flex-col justify-center text-[32px] w-full ml-2")}>
					<div {...twcl("font-bold pt-1")}>Proem Science Answers</div>
					<div {...twcl("text-white/50 pt-1")}>
						Based on 250M research papers
					</div>
				</div>
			</div>

			<div {...twcl("flex flex-wrap text-[40px] leading-1.6 flex-1 mt-4 mb-0")}>
				{content}
			</div>
		</div>
	);
}
