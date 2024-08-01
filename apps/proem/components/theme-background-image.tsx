import { cn } from "@proemial/shadcn-ui";
import Image from "next/image";

type ThemeBackgroundImageProps = Pick<
	Parameters<typeof Image>[0],
	"src" | "style"
> & {
	className?: string;
};

export const ThemeBackgroundImage = ({
	src,
	className,
	style,
}: ThemeBackgroundImageProps) => (
	<Image
		src={src}
		style={style}
		alt="Theme background image"
		quality={100}
		className={cn("w-full min-w-72", className)}
		width={600}
		height={600}
	/>
);
