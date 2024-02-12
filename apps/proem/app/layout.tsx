import { AnalyticsClient } from "@/app/components/analytics/analytics";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import "./globals.css";
import { Source_Code_Pro } from "next/font/google";
import { Metadata } from "next";

// If loading a variable font, you don't need to specify the font weight
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

const lightModeEnabled = false;

const title = "proem";
const url = "https://proem.ai";
const description =
  "answers to your questions supported by scientific research";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(url),
  openGraph: {
    type: "website",
    url,
    title,
    description,
    siteName: title,
  },
};
type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const light = lightModeEnabled ? "dark:dark" : "dark";

  return (
    <ClerkProvider>
      <html lang="en" className={sourceCodePro.variable}>
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
