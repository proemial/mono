import iconBulb from "./iconBulb.svg";
import logos from "./logos.svg";
import Image from "next/image";
import { Lato } from "next/font/google";

// Initialize the Lato font with the weights we need
const lato = Lato({
	weight: ["400", "700", "900"],
	subsets: ["latin"],
	display: "swap",
});

export default function WelcomePage() {
	return (
		<div
			className={`flex items-center justify-center min-h-screen bg-white ${lato.className}`}
		>
			<div className="w-[460px] flex flex-col items-center gap-12 p-6">
				<Image
					alt="Proem and Slack Logo"
					src={logos.src}
					width={265}
					height={36}
				/>
				<h1 className="text-5xl font-black text-zinc-900 text-center font-sans">
					Success!
				</h1>

				<div className="text-center flex gap-6 flex-col">
					<p className="text-lg text-zinc-700">
						<span className="font-bold">@proem</span> has joined your Slack
						workspace.
					</p>

					<p className="text-lg text-zinc-700">
						<span className="font-bold">@proem</span> will join in and write
						crisp summaries of the links and files you share, and will answer
						any question when you message it.
					</p>
				</div>

				<a
					href="slack://open"
					className="w-full py-2.5 px-16 bg-fuchsia-950 rounded-xl text-white text-lg font-bold text-center inline-block"
				>
					Return to Slack
				</a>

				<div className="flex items-center gap-3 p-3 bg-zinc-900/5 rounded-lg w-full">
					<Image
						className="relative w-[19px] h-[18px]"
						alt="Icon Bulb"
						src={iconBulb.src}
						width={19}
						height={18}
					/>
					<p className="text-zinc-600 text-base">
						Tag <span className="font-bold">@proem</span> in a channel to add it
						to your conversation.
					</p>
				</div>
			</div>
		</div>
	);
}
