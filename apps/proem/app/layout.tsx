import { MainMenu } from "@/app/components/menu/menu";
import { ClerkProvider, currentUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import "./globals.css";
import { AnalyticsClient } from "@/app/components/analytics/analytics";

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
  console.log({ currentUserFromRootLayout: user });

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`flex justify-center overflow-clip ${light}`}>
          <main
            className="min-h-screen max-h-screen w-full max-w-[640px] flex flex-col"
            style={{
              minHeight: "100dvh",
              maxHeight: "100dvh",
            }}
          >
            <div className={`flex-1 overflow-y-scroll overflow-x-clip`}>
              {children}
            </div>
            <MainMenu />
          </main>
          <AnalyticsClient />
        </body>
      </html>
    </ClerkProvider>
  );
}
