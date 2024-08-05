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
				"p-3.5 pt-2 rounded-2xl relative overflow-hidden",
				{
					"bg-purple-400/30": theme?.color === "purple",
					"bg-teal-400/30": theme?.color === "teal",
					"bg-gold-400/30": theme?.color === "gold",
					"bg-green-400/40": theme?.color === "green",
					"bg-rose-400/30": theme?.color === "rose",
				},
				className,
			)}
		>
			{theme?.image ? (
				<div
					className="absolute inset-0 opacity-50"
					style={{
						maskImage:
							"linear-gradient(rgba(0,0,0,1) 0%, rgba(0,0,0,0.37) 51%, rgba(0,0,0,0) 100%)",
					}}
				>
					<ThemeBackgroundImage pattern={theme.image} />
				</div>
			) : null}

			<div className="relative">{children}</div>
		</div>
	);
};
