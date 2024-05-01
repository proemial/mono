import "@/app/globals.css";
import { Analytics } from "@/components/analytics";
import "@/env";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, cn } from "@proemial/shadcn-ui";
import { Metadata, Viewport } from "next";
import { Lato as FontSans } from "next/font/google";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { screenMaxWidth } from "./constants";

export const viewport: Viewport = {
	width: "device-width",
	viewportFit: "cover",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	// Also supported by less commonly used
	// interactiveWidget: 'resizes-visual',
};

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
	icons: [
		{
			rel: "icon",
			type: "image/x-icon",
			url: "/favicon.ico",
			media: "(prefers-color-scheme: light)",
		},
		{
			rel: "icon",
			type: "image/x-icon",
			url: "/favicon-darkmode.ico",
			media: "(prefers-color-scheme: dark)",
		},
	],
};

const fontSans = FontSans({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-sans",
});

type Props = {
	children: ReactNode;
	modal: ReactNode;
};

export default function RootLayout({ children, modal }: Readonly<Props>) {
	const trackingInput = getTrackingInput();
	return (
		<ClerkProvider>
			<Analytics.PostHog tracking={trackingInput}>
				<html
					lang="en"
					className="overscroll-none"
					style={{ scrollbarGutter: "stable" }}
					suppressHydrationWarning
				>
					<head>
						<meta
							name="facebook-domain-verification"
							content="ua85vc0pbvtj0hyzp6df2ftzgmmglr"
						/>
					</head>
					<body
						className={cn(
							"min-h-[100dvh] h-full font-sans antialiased max-w-full",
							fontSans.variable,
						)}
					>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							enableSystem
							disableTransitionOnChange
						>
							<div vaul-drawer-wrapper="">
								<div className="bg-background">
									<div
										className={`${screenMaxWidth} mx-auto min-h-[100dvh] flex flex-col`}
									>
										<main className="w-full flex flex-col flex-grow">
											{children}
										</main>
										{modal}
									</div>
								</div>
							</div>
							<Analytics.Clients tracking={trackingInput} />
						</ThemeProvider>
					</body>
				</html>
			</Analytics.PostHog>
		</ClerkProvider>
	);
}

function getTrackingInput() {
	const headersList = headers();
	const country = headersList.get("x-country") ?? undefined;
	const region = headersList.get("x-region") ?? undefined;
	const userAgent = headers().get("user-agent") ?? undefined;

	return { country, region, userAgent };
}
