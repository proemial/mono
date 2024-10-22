import { screenMaxWidth } from "@/app/constants";
import { LoadingTransition } from "@/components/loading-transition";
import { Main } from "@/components/main";
import { ProemAssistant } from "@/components/proem-assistant/assistant";
import { TopNavigation } from "@/components/top-navigation/top-navigation";
import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<div className="bg-background group relative">
			<div
				style={{
					boxShadow: "0 0 120px rgba(0, 0, 0, .15)",
				}}
				className={cn("mx-auto min-h-[100dvh] flex flex-col", screenMaxWidth)}
			>
				<TopNavigation />
				<LoadingTransition type="page" as={Main}>
					{children}
				</LoadingTransition>
			</div>
			<ProemAssistant />
		</div>
	);
}
