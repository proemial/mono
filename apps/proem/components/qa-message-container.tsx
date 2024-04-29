import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { ReactNode, useRef } from "react";

type QAMessageContainerProps = {
	children: ReactNode;
	grow: boolean;
};

export const QAMessageContainer = ({
	children,
	grow,
}: QAMessageContainerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useRunOnFirstRender(() => {
		if (containerRef.current) {
			containerRef.current.scrollIntoView({ behavior: "smooth" });
		}
	});

	return (
		<div
			ref={containerRef}
			className={`flex flex-col gap-6 place-items-end ${
				grow ? "min-h-[calc(100dvh-208px)]" : ""
			}`}
		>
			{children}
		</div>
	);
};
