import { Main } from "@/components/main";
import { ReactNode } from "react";

type PageProps = {
	children: ReactNode;
};

export default async function SpaceLayout({ children }: PageProps) {
	return <Main className="pt-0">{children}</Main>;
}
