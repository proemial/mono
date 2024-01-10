import { AnalyticsClient } from "@/app/components/analytics/analytics";
import { LoginDrawer } from "@/app/components/login/login-drawer";
import { PageHeader } from "@/app/components/page-header";
import { Toaster } from "@/app/components/shadcn-ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import "./globals.css";

const lightModeEnabled = false;

export const metadata = {
  title: "proem",
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const light = lightModeEnabled ? "dark:dark" : "dark";

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`flex justify-center overflow-clip ${light}`}>
          <main
            className="flex flex-col w-full max-h-screen min-h-screen"
            style={{
              minHeight: "100dvh",
              maxHeight: "100dvh",
            }}
          >
            <PageHeader />
            <div
              className={`flex-1 overflow-y-scroll overflow-x-clip no-scrollbar`}
            >
              {children}
            </div>
            {/* <MainMenu /> */}
          </main>
          <LoginDrawer />
          <Toaster />
          <AnalyticsClient />
        </body>
      </html>
    </ClerkProvider>
  );
}
