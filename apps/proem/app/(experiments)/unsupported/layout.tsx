import { screenMaxWidth } from "@/app/constants";
import { cn } from "@proemial/shadcn-ui";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};
import { Lato } from 'next/font/google'

const lato = Lato({
  weight: '400',
  subsets: ['latin'],
})

export default function Layout({ children }: Props) {
	return (
		<div className={cn("bg-[#000000] group relative", lato.className)}>
			<div
				style={{
					boxShadow: "0 0 120px rgba(0, 0, 0, .15)",
				}}
				className={cn("mx-auto min-h-[100dvh] flex flex-col", screenMaxWidth)}
			>
				{children}
			</div>
		</div>
	);
}
