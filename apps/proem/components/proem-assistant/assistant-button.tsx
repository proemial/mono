import { Button, cn } from "@proemial/shadcn-ui";

type Props = {
	onClick: () => void;
	variant?: "dark" | "light";
};

export const AssistantButton = ({ onClick, variant = "dark" }: Props) => {
	return (
		<Button
			type="button"
			variant="suggestion"
			size="suggestion"
			className={cn(
				"drop-shadow-xl hover:drop-shadow-lg pointer-events-auto mx-8 justify-center rounded-full p-3 max-w-[480px]",
				{
					"bg-theme-900 hover:bg-theme-950 text-white": variant === "dark",
					"hover:bg-theme-200": variant === "light",
				},
			)}
			onClick={onClick}
		>
			Ask a question
		</Button>
	);
};
