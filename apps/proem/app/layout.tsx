import { Analytics } from "@/app/components/analytics/analytics";
import { PostHogClient } from "@/app/components/analytics/posthog-client";
import "@/app/globals.css";
import "@/env";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata, Viewport } from "next";
import { Source_Code_Pro } from "next/font/google";
import { ReactNode } from "react";
import { headers } from 'next/headers'

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

	const { region } = geoHeaders();

	return (
		<ClerkProvider>
			<PostHogClient region={region}>
				<html lang="en" className={sourceCodePro.variable}>
					<head>
						<meta name="facebook-domain-verification" content="ua85vc0pbvtj0hyzp6df2ftzgmmglr" />
					</head>
					<body
						className={`${light} h-dvh w-dvw flex flex-col justify-center items-center`}
					>
						{children}
						<Analytics />
					</body>
				</html>
			</PostHogClient>
		</ClerkProvider>
	);
}

function geoHeaders() {
	const headersList = headers()
	const country = headersList.get('x-country') ?? undefined;
	const region = headersList.get('x-region') ?? undefined;

	return { country, region }
}
