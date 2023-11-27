import "./globals.css";
import type { Metadata } from "next";
import { Anek_Malayalam } from "next/font/google";
import { ReactNode } from "react";
import { AnalyticsClient } from "@/app/components/analytics";

const font = Anek_Malayalam({ subsets: ["latin"], display: "swap" });
const lightModeEnabled = false;

export const metadata: Metadata = {
  title: "Proem",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const light = lightModeEnabled ? "dark:dark" : "dark";

  return (
    // <UserProvider>
    <html lang="en">
      <body
        className={`${font.className} flex justify-center overflow-clip ${light}`}
      >
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

          {/*<MainMenu />*/}
        </main>
        <AnalyticsClient />
      </body>
    </html>
    // </UserProvider>
  );
}
