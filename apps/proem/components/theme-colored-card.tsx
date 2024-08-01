import { Theme } from "@/app/theme/color-theme";
import { ThemeBackgroundImage } from "@/components/theme-background-image";
import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";

type ThemeColoredCardProps = {
	children: ReactNode;
	theme: Theme;
	className?: string;
};

export const ThemeColoredCard = ({
	children,
	theme,
	className,
}: ThemeColoredCardProps) => {
	return (
		<div
			className={cn(
				"p-3 rounded-2xl relative overflow-hidden",
				{
					"bg-gradient-to-b from-purple-400 to-purple-400/20":
						theme?.color === "purple",
					"bg-gradient-to-b from-gold-400 to-gold-400/20":
						theme?.color === "gold",
					"bg-gradient-to-b from-teal-400 to-teal-400/20":
						theme?.color === "teal",
					"bg-gradient-to-b from-green-400 to-green-400/20":
						theme?.color === "green",
					"bg-gradient-to-b from-rose-400 to-rose-400/20":
						theme?.color === "rose",
				},
				className,
			)}
		>
			{theme?.image ? (
				<div className="absolute inset-0 opacity-50">
					<ThemeBackgroundImage
						src={`/backgrounds/patterns_${theme.image}.png`}
						style={{
							maskImage:
								"linear-gradient(rgba(0,0,0,1) 0%, rgba(0,0,0,0.37) 51%, rgba(0,0,0,0) 100%)",
						}}
					/>
				</div>
			) : null}

			<div className="relative">{children}</div>
		</div>
	);
};
