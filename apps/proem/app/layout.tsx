import { AnalyticsClient } from "@/app/components/analytics/analytics";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import "./globals.css";
import { Source_Code_Pro } from "next/font/google";
import { Metadata } from "next";
import { PostHogClient } from "@/app/components/analytics/posthog-client";
import { cookies, headers } from 'next/headers'


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
  robots: {
    index: false,
    follow: false,
  },
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
  const headersList = headers()
  const cookieStore = cookies()
  console.log({headersList})
  console.log({cookieStore})
  // const referer = headersList.get('referer')

  return (
    <ClerkProvider>
      <PostHogClient>
        <html lang="en" className={sourceCodePro.variable}>
          <body
            className={`flex relative flex-col justify-center ${light} h-dvh`}
          >
            {children}

            <AnalyticsClient />
          </body>
        </html>
      </PostHogClient>
    </ClerkProvider>
  );
}
