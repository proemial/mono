import { cn, Icons } from "@proemial/shadcn-ui";

type Props = {
	className?: string;
	throbberStyle?: string;
};

export function Throbber({ className, throbberStyle }: Props) {
	return (
		<div
			className={cn("w-full h-24 flex justify-center items-center", className)}
		>
			<Icons.loader className={cn("fill-theme-800/70", throbberStyle)} />
		</div>
	);
}
