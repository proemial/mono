import { AnalyticsClient } from "@/app/components/analytics/analytics";
import { LoginDrawer } from "@/app/components/login/login-drawer";
import { PageHeader } from "@/app/components/page-header";
import { Toaster } from "@/app/components/shadcn-ui/toaster";
import { ClerkProvider, currentUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import "./globals.css";

import { Source_Code_Pro } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

const lightModeEnabled = false;

export const metadata = {
  title: "proem",
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const light = lightModeEnabled ? "dark:dark" : "dark";
  const user = await currentUser();

  return (
    <ClerkProvider>
      <html lang="en" className={sourceCodePro.className}>
        <body className={`flex relative flex-col justify-center ${light}`}>
          <PageHeader isLoggedIn={Boolean(user)} />
          <div className="w-full max-w-screen-md mx-auto">{children}</div>
          {/* <MainMenu /> */}
          <LoginDrawer />
          <Toaster />
          <AnalyticsClient />
        </body>
      </html>
    </ClerkProvider>
  );
}
