import { ReactNode } from "react";
import WithHeader from "@/app/components/with-header";

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return <WithHeader title="reader">{children}</WithHeader>;
}
