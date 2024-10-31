import { cn, Icons } from "@proemial/shadcn-ui";

type Props = {
	className?: string;
};

export function Throbber({ className }: Props) {
	return (
		<div
			className={cn("w-full h-24 flex justify-center items-center", className)}
		>
			<Icons.loader className="fill-theme-800/70" />
		</div>
	);
}
