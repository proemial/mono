import "@/app/globals.css";
import { Analytics } from "@/components/analytics";
import { NotificationsToaster } from "@/components/notifications-toaster";
import { AssistantStateProvider } from "@/components/proem-assistant/use-assistant/assistant-state";
import { ReactQueryProvider } from "@/components/providers/react-query";
import { TooltipProvider, cn } from "@proemial/shadcn-ui";
import { Metadata, Viewport } from "next";
import { Lato as FontSans } from "next/font/google";
import { headers as nextHeaders } from "next/headers";
import { ReactNode } from "react";
import { Lato } from "next/font/google";

export const viewport: Viewport = {
	width: "device-width",
	viewportFit: "cover",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

const title = "Proem News";
const url = "http://localhost:4243";
const description = "Proem News - trustworthy perspectives";

const lato = Lato({
	weight: "400",
	subsets: ["latin"],
});

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
};

const fontSans = FontSans({
	weight: ["300", "400", "700"],
	subsets: ["latin"],
	variable: "--font-sans",
});

type Props = {
	children: ReactNode;
};

export default function RootLayout({ children }: Readonly<Props>) {
	return (
		<html lang="en" className="overscroll-none" suppressHydrationWarning>
			<head>
				<meta
					name="facebook-domain-verification"
					content="ua85vc0pbvtj0hyzp6df2ftzgmmglr"
				/>
			</head>
			<body
				className={cn(
					"bg-black min-h-[100dvh] flex flex-col font-sans antialiased",
					fontSans.variable,
				)}
			>
				<ContextWrapper>
					<div className={cn("bg-[#000000] group relative", lato.className)}>
						<div
							style={{
								boxShadow: "0 0 120px rgba(0, 0, 0, .15)",
							}}
							className={cn(
								"mx-auto min-h-[100dvh] flex flex-col max-w-[550px] lg:max-w-none border-black",
							)}
						>
							{children}
						</div>
					</div>
					<NotificationsToaster />
				</ContextWrapper>
			</body>
		</html>
	);
}

function ContextWrapper({ children }: { children: ReactNode }) {
	const trackingInput = getHeaders();

	return (
		<Analytics.PostHog tracking={trackingInput}>
			<AssistantStateProvider>
				<TooltipProvider>
					<ReactQueryProvider>
						{children}
						<Analytics.Clients tracking={trackingInput} />
					</ReactQueryProvider>
				</TooltipProvider>
			</AssistantStateProvider>
		</Analytics.PostHog>
	);
}

function getHeaders() {
	const headersList = nextHeaders();
	const userAgent = headersList.get("user-agent") ?? undefined;
	const embedded = false;

	return { userAgent, embedded };
}
