import logo from "../../../components/images/logo.svg";
import Image from "next/image";

export function BotQa({
	user,
	qa,
}: {
	user?: { image: string; name: string; time: string };
	qa: [string, string];
}) {
	const formatAnswerText = (text?: string) => {
		if (!text) return '';
		// Remove leading spaces and dashes
		const cleanText = text.replace(/^[\s-]+/g, '');
		// Split text into segments based on link pattern
		return cleanText.split(/(\[.*?\])/).map((segment, i) => {
			const match = segment.match(/\[(.*?)\]/);
			if (match) {
				// Always split and iterate through numbers
				const numbers = match[1].split(',').map(n => n.trim());
				return numbers.map((num, j) => (
					<div className="relative inline">
						<a key={`${i}-${j}`} className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold cursor-pointer hover:bg-gray-800 relative -top-[2px]">
							{num}
						</a>
					</div>
				));
			}
			// Return regular text for non-link segments
			return segment;
		});
	};

	return (
		<div className="flex-col items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative">
			<div className="flex items-start gap-1.5 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex w-10 h-10 items-center gap-1 relative">
					<img
						className="relative w-10 h-10 object-cover w-8 h-8 rounded-full"
						alt=""
						src={user?.image}
					/>
				</div>

				<div className="flex flex-col items-start gap-1 relative flex-1 grow">
					<div className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] rounded-xl">
						<div className="items-start gap-1 self-stretch w-full flex-[0_0_auto] flex relative">
							<div className="relative flex-1 mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px]">
								{user?.name}
							</div>

							<div className="relative w-fit mt-[-1.00px] font-medium text-[#747888] text-xs tracking-[0.24px] leading-[14px] whitespace-nowrap">
								{user?.time}
							</div>
						</div>

						<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
							{qa.at(0)}
						</p>
					</div>
				</div>
			</div>

			<div className="flex-col items-start gap-2 pl-[58px] pr-3 py-0 self-stretch w-full flex-[0_0_auto] flex relative">
				<div className="items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
					<div className="relative flex-[0_0_auto] w-8 h-8 rounded-full bg-black flex items-center justify-center">
						<Image
							className="w-4 h-4"
							alt="Frame"
							src={logo}
						/>
					</div>

					<div className="flex flex-col items-start gap-1 relative flex-1 grow">
						<div className="flex-col gap-1 p-3 self-stretch w-full flex-[0_0_auto] bg-[#e9eaee] flex items-center justify-center relative rounded-xl">
							<div className="items-start gap-1 self-stretch w-full flex-[0_0_auto] flex relative">
								<div className="relative w-fit mt-[-1.00px] font-bold text-[#08080a] text-sm tracking-[0] leading-[14px] whitespace-nowrap">
									proem.ai
								</div>

								<div className="inline-flex items-center justify-center gap-2 px-1 py-0 relative flex-[0_0_auto] bg-[#ebf5ff] rounded-xl">
									<div className="relative w-fit mt-[-1.00px] font-medium text-[#0164d0] text-[11px] tracking-[0] leading-[14px] whitespace-nowrap">
										Research bot
									</div>
								</div>
							</div>

							<p className="relative self-stretch font-medium text-[#08080a] text-[15px] tracking-[0] leading-5">
								{formatAnswerText(qa[1])}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-end gap-4 pl-0 pr-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
				<p className="relative w-fit mt-[-1.00px] font-normal text-[#65686d] text-[13px] tracking-[0] leading-[normal]">
					<span className="font-bold">Like</span>

					<span className="font-medium">
						{" "}
						· 42
					</span>
				</p>

				<div className="relative w-fit mt-[-1.00px] font-bold text-[#65686d] text-[13px] tracking-[0] leading-[normal]">
					Share
				</div>
			</div>
		</div>
	);
}
