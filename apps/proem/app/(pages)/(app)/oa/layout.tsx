import WithHeader from "@/app/(pages)/(app)/header";
import { ReactNode } from "react";

const pageName = "read";

type Props = {
	children: ReactNode;
};

export default async function ReaderLayout({ children }: Props) {
	return <WithHeader title={pageName}>{children}</WithHeader>;
}
