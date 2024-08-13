import { ProemAssistant } from "@/components/proem-assistant/assistant";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<>
			{children}
			<ProemAssistant />
		</>
	);
}
