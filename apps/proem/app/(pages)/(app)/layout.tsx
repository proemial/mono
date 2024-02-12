import { ReactNode } from "react";
import { LoginDrawer } from "@/app/components/login/login-drawer";
import { Toaster } from "@/app/components/shadcn-ui/toaster";
import { MainMenu } from "@/app/components/menu/menu";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  return (
    <>
      {children}

      <LoginDrawer />
      <MainMenu />
      <Toaster />
    </>
  );
}
