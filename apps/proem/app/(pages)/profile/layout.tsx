import { ReactNode } from "react";
import WithHeader from "@/app/components/with-header";

export const metadata = {
  title: "proem - profile",
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return <WithHeader title="profile">{children}</WithHeader>;
}
