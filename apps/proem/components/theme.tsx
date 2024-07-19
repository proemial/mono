import { hex2rgba } from "@proemial/utils/color";
import { numberFrom } from "@proemial/utils/string";
import { ReactNode } from "react";

type BackgroundImage = { regular: string; faded: string };

const images: Array<BackgroundImage> = [
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

const colors = ["#AFB3C3", "#9FBBBD", "#BDE6D0", "#DED5D5", "#E2D1B7"];

const bgColor = "#F5F5F5";

export const Theme = {
	color: (seed: string) =>
		colors[numberFrom(seed, colors.length - 1)] as string,

	image: (seed: string) =>
		images[numberFrom(seed, images.length - 1)] as BackgroundImage,

	style: (seed: string, position?: "top" | "bottom") => {
		const color = Theme.color(seed);
		const image = Theme.image(seed);

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
	},

	header: ({ children, title }: { children: ReactNode; title: string }) => (
		<ThemedHeader title={title}>{children}</ThemedHeader>
	),

	headers: {
		top: ({
			children,
			seed,
			unstyled,
		}: { children: ReactNode; seed: string; unstyled?: boolean }) => (
			<ThemedTopHeader seed={seed} unstyled={unstyled}>
				{children}
			</ThemedTopHeader>
		),

		bottom: ({
			children,
			seed,
			unstyled,
		}: { children: ReactNode; seed: string; unstyled?: boolean }) => (
			<ThemedBottomHeader seed={seed} unstyled={unstyled}>
				{children}
			</ThemedBottomHeader>
		),
	},
};

function ThemedHeader({
	children,
	title,
}: { children: ReactNode; title: string }) {
	return (
		<div>
			<ThemedTopHeader seed={title}>{children}</ThemedTopHeader>
			<ThemedBottomHeader seed={title}>{title}</ThemedBottomHeader>
		</div>
	);
}

function ThemedTopHeader({
	children,
	seed,
	unstyled,
}: { children: ReactNode; seed: string; unstyled?: boolean }) {
	const style = unstyled ? {} : Theme.style(seed);

	return (
		<div className="pb-16" style={style}>
			{children}
		</div>
	);
}

function ThemedBottomHeader({
	children,
	seed,
	unstyled,
}: { children: ReactNode; seed: string; unstyled?: boolean }) {
	const style = unstyled ? {} : Theme.style(seed, "bottom");

	return (
		<div className={`px-4 pb-8 text-black text-2xl leading-9"`} style={style}>
			{children}
		</div>
	);
}
