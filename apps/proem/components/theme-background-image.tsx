import Image from "next/image";

type ThemeBackgroundImageProps = {
	src: string;
};

export const ThemeBackgroundImage = ({ src }: ThemeBackgroundImageProps) => (
	<Image
		src={src}
		alt="Theme background image"
		quality={100}
		className="w-full min-w-72"
		width={600}
		height={600}
	/>
);
