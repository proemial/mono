import { Analytics } from "@/app/components/analytics";
import { cn } from "@/app/components/shadcn-ui/utils";
import "@/app/globals.css";
import "@/env";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@proemial/shadcn-ui";
import { Metadata, Viewport } from "next";
import { Lato as FontSans } from "next/font/google";
import { headers } from "next/headers";
import { ReactNode } from "react";

export const viewport: Viewport = {
	width: "device-width",
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
				<html lang="en" className="overscroll-none" suppressHydrationWarning>
					<head>
						<meta
							name="facebook-domain-verification"
							content="ua85vc0pbvtj0hyzp6df2ftzgmmglr"
						/>
					</head>
					<body
						className={cn(
							"min-h-screen h-full bg-background font-sans antialiased max-w-full",
							fontSans.variable,
						)}
					>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							enableSystem
							disableTransitionOnChange
						>
							<div className="max-w-screen-md mx-auto" vaul-drawer-wrapper="">
								<main className="w-full">{children}</main>
								{modal}

								<Analytics.Vercel tracking={trackingInput} />
								<Analytics.Google tracking={trackingInput} />
							</div>
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
