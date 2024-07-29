import { ReactNode } from "react";

export const Main = ({ children }: { children: ReactNode }) => {
	return (
		<main className="w-full p-4 pb-0 flex flex-col flex-grow z-10">
			{children}
		</main>
	);
};
