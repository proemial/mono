import { Icons } from "@proemial/shadcn-ui";

export function Throbber() {
	return (
		<div className="w-full h-24 flex justify-center items-center">
			<Icons.loader className="fill-theme-800/70" />
		</div>
	);
}
