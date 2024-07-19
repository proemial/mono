import { hex2rgba } from "@proemial/utils/color";
import { numberFrom } from "@proemial/utils/string";
import { ReactNode } from "react";

const bgColor = "£F5F5F5";

const colors = ["#AFB3C3", "#9FBBBD", "#BDE6D0", "#DED5D5", "#E2D1B7"];

const images = [
	{
		regular: "patterns_01_posterized.png",
		faded: "patterns_01_posterized_top.png",
	},
	{
		regular: "patterns_02_posterized.png",
		faded: "patterns_02_posterized_top.png",
	},
	{
		regular: "patterns_03_posterized.png",
		faded: "patterns_03_posterized_top.png",
	},
	{
		regular: "patterns_04_posterized.png",
		faded: "patterns_04_posterized_top.png",
	},
];

export function headerStyle(seed: string, position?: "top" | "bottom") {
	const color = colors[numberFrom(seed, 4)] as string;
	const image = images[numberFrom(seed, 3)];

	if (position === "bottom") {
		return {
			backgroundSize: "50%",
			backgroundPosition: "top",
			backgroundImage: `url('/backgrounds/${
				image?.faded
			}'),linear-gradient(${hex2rgba(color)}, ${hex2rgba(bgColor)})`,
		};
	}

	return {
		backgroundSize: "50%",
		backgroundPosition: "bottom",
		backgroundImage: `url('/backgrounds/${image?.regular}')`,
		backgroundColor: color,
	};
}

export default async function StyledHeader({
	children,
	title,
}: { children: ReactNode; title: string }) {
	return (
		<div>
			<div className="pb-16" style={{ ...headerStyle(title) }}>
				{children}
			</div>
			<div
				className={`px-4 pb-8 text-black text-2xl leading-9"`}
				style={{ ...headerStyle(title, "bottom") }}
			>
				{title}
			</div>
		</div>
	);
}
