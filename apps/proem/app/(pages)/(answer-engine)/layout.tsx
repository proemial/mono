import { ReactNode } from "react";
import WithHeader from "@/app/components/with-header";

export const metadata = {
  title: "proem - science answers",
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return <WithHeader title="science answers">{children}</WithHeader>;
}
