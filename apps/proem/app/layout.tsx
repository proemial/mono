import { Analytics } from "@/app/components/analytics/analytics";
import { PostHogClient } from "@/app/components/analytics/posthog-client";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata, Viewport } from "next";
import { Source_Code_Pro } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

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

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

type Props = {
	children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
	const light = lightModeEnabled ? "dark:dark" : "dark";
	return (
		<ClerkProvider>
			<PostHogClient>
				<html lang="en" className={sourceCodePro.variable}>
					<body className={`${light} h-dvh w-dvw`}>
						{children}
						<Analytics />
					</body>
				</html>
			</PostHogClient>
		</ClerkProvider>
	);
}
