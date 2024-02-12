import { ReactNode } from "react";
import WithHeader from "@/app/(pages)/(app)/header";

const pageName = "profile";

export const metadata = {
  title: `proem - ${pageName}`,
};

type Props = {
  children: ReactNode;
};

export default async function ProfileLayout({ children }: Props) {
  return <WithHeader title={pageName}>{children}</WithHeader>;
}
