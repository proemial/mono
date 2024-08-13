import { Button, cn } from "@proemial/shadcn-ui";
import { ProemLogo } from "../icons/brand/logo";

type Props = {
	onClick: () => void;
	variant?: "dark" | "light";
};

export const AssistantButton = ({ onClick, variant = "dark" }: Props) => {
	return (
		<Button
			type="button"
			variant="default"
			size="icon"
			className={cn(
				"drop-shadow-xl hover:drop-shadow-lg pointer-events-auto w-16 h-16 rounded-full",
				{
					"bg-theme-900 hover:bg-theme-950": variant === "dark",
					"hover:bg-theme-200": variant === "light",
				},
			)}
			onClick={onClick}
		>
			<ProemLogo size="sm" className={cn(variant === "dark" && "text-white")} />
		</Button>
	);
};
