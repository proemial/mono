import { MainMenuUnfixed } from "@/app/components/menu/menu";
import { PageHeaderUnfixed } from "@/app/components/page-header";
import { ReactNode } from "react";
import { HideOnInput } from "./page-layout-focus";

type Props = {
	title: string;
	children: [ReactNode, ReactNode] | ReactNode;
	action?: ReactNode;
};

export function PageLayout({ title, children, action }: Props) {
	const [first, second] = Array.isArray(children) ? children : [children, null];

	return (
		<div className="flex flex-col w-full min-h-full">
			<div className="sticky top-0 z-50 w-full pb-2 bg-black flex-0 shadow-bottom">
				<PageHeaderUnfixed title={title} action={action} />
			</div>

			<div className="flex flex-col flex-1 w-full px-4">{first}</div>

			<div className="sticky bottom-0 left-0 w-full p-1 bg-black flex-0 shadow-top">
				{second}
				<HideOnInput>
					<MainMenuUnfixed />
				</HideOnInput>
			</div>
		</div>
	);
}
