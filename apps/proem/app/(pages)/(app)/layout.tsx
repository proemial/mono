import { ReactNode } from "react";
import { LoginDrawer } from "@/app/components/login/login-drawer";
import { Toaster } from "@/app/components/shadcn-ui/toaster";
import { MainMenu } from "@/app/components/menu/menu";
import { ShareDrawer } from "@/app/components/share/share-drawer";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  return (
    <>
      {children}

      <LoginDrawer />
      <ShareDrawer />
      <MainMenu />
      <Toaster />
    </>
  );
}
