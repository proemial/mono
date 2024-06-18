import "@/app/globals.css";
import { Analytics } from "@/components/analytics";
import { NotificationsToaster } from "@/components/notifications-toaster";
import { ProemAssistant } from "@/components/proem-assistant";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReactQueryProvider } from "@/components/providers/react-query";
import { SetActiveOrganization } from "@/components/set-active-organization";
import "@/env";
import { ThemeProvider, cn } from "@proemial/shadcn-ui";
import { Metadata, Viewport } from "next";
import { Lato as FontSans } from "next/font/google";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { getInternalUser } from "./hooks/get-internal-user";

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
	robots: {
		index: false,
		follow: false,
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
	const { isInternal } = getInternalUser();

	return (
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
				<ThemeProvider>
					<AuthProvider>
						<Analytics.PostHog tracking={trackingInput}>
							<ReactQueryProvider>
								<SetActiveOrganization />
								<div vaul-drawer-wrapper="">
									<div className="bg-background">
										{children}
										{modal}
										<ProemAssistant internalUser={isInternal} />
									</div>
								</div>

								<NotificationsToaster />
								<Analytics.Clients tracking={trackingInput} />
							</ReactQueryProvider>
						</Analytics.PostHog>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

function getTrackingInput() {
	const headersList = headers();
	const country = headersList.get("x-country") ?? undefined;
	const region = headersList.get("x-region") ?? undefined;
	const userAgent = headers().get("user-agent") ?? undefined;

	return { country, region, userAgent };
}
