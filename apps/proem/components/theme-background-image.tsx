import { ThemePatterns } from "@/app/theme/color-theme";
import { cn } from "@proemial/shadcn-ui";
import Image, { StaticImageData } from "next/image";
import fingerprintPattern from "../public/backgrounds/patterns_fingerprint.png";
import leafsPattern from "../public/backgrounds/patterns_leafs.png";
import paintPattern from "../public/backgrounds/patterns_paint.png";
import siliconPattern from "../public/backgrounds/patterns_silicon.png";

type ThemeBackgroundImageProps = Pick<Parameters<typeof Image>[0], "style"> & {
	className?: string;
	pattern: ThemePatterns;
};

const patterns: Record<ThemePatterns, StaticImageData> = {
	silicon: siliconPattern,
	leafs: leafsPattern,
	paint: paintPattern,
	fingerprint: fingerprintPattern,
};

export const ThemeBackgroundImage = ({
	pattern,
	className,
	style,
}: ThemeBackgroundImageProps) => {
	const src = patterns[pattern];

	return (
		<Image
			src={src}
			style={style}
			alt="Theme background image"
			quality={100}
			placeholder="blur"
			className={cn("w-full min-w-72", className)}
			width={600}
			height={600}
		/>
	);
};
