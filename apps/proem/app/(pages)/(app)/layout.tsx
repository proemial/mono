import { ReactNode } from "react";
import { LoginDrawer } from "@/app/components/login/login-drawer";
import { MainMenu } from "@/app/components/menu/menu";
import { Toaster } from "@/app/components/shadcn-ui/toaster";

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <>
      {children}

      <LoginDrawer />
      <MainMenu />
      <Toaster />
    </>
  );
}
