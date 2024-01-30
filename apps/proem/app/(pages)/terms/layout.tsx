import { ReactNode } from "react";
import WithHeader from "@/app/components/with-header";
export const metadata = {
  title: "Terms of Service for Proem",
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return <WithHeader title="proem">{children}</WithHeader>;
}
