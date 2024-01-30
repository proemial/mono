import { AnalyticsClient } from "@/app/components/analytics/analytics";
import { ClerkProvider } from "@clerk/nextjs";
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

  return (
    <ClerkProvider>
      <html lang="en" className={sourceCodePro.className}>
        <body
          className={`flex relative flex-col justify-center ${light} h-dvh`}
        >
          {children}

          <AnalyticsClient />
        </body>
      </html>
    </ClerkProvider>
  );
}
