import { ReactNode } from "react";
import WithHeader from "@/app/(pages)/(app)/header";

const pageName = "reader";

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return <WithHeader title={pageName}>{children}</WithHeader>;
}
