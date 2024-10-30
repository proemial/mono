import "@/app/globals.css";
import { Analytics } from "@/components/analytics";
import { LoadingTransition } from "@/components/loading-transition";
import { NotificationsToaster } from "@/components/notifications-toaster";
import { AssistantStateProvider } from "@/components/proem-assistant/use-assistant/assistant-state";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReactQueryProvider } from "@/components/providers/react-query";
import { SetActiveOrganization } from "@/components/set-active-organization";
import { isEmbedded } from "@/utils/url";
import { TooltipProvider, cn } from "@proemial/shadcn-ui";
import { VercelToolbar } from "@vercel/toolbar/next";
import { Metadata, Viewport } from "next";
import { Lato as FontSans } from "next/font/google";
import { headers as nextHeaders } from "next/headers";
import { ReactNode } from "react";

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
	weight: ["300", "400", "700"],
	subsets: ["latin"],
	variable: "--font-sans",
});

type Props = {
	children: ReactNode;
	modal: ReactNode;
	showToolbar: boolean;
};

export default function RootLayout({ children, modal }: Readonly<Props>) {
	const headers = getHeaders();
	const showToolbar = process.env.NODE_ENV === "development";

	if (headers.embedded) {
		return (
			<EmbeddedLayout showToolbar={showToolbar}>{children}</EmbeddedLayout>
		);
	}

	return (
		<MainLayout modal={modal} showToolbar={showToolbar}>
			{children}
		</MainLayout>
	);
}

function MainLayout({ children, modal, showToolbar }: Readonly<Props>) {
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
					"bg-black min-h-[100dvh] h-full font-sans antialiased max-w-full",
					fontSans.variable,
				)}
			>
				<ContextWrapper>
					<SetActiveOrganization />
					{children}
					{modal}
					<NotificationsToaster />
				</ContextWrapper>
				{showToolbar && <VercelToolbar />}
			</body>
		</html>
	);
}
function EmbeddedLayout({
	children,
	showToolbar,
}: { children: ReactNode; showToolbar: boolean }) {
	return (
		<html lang="en" className="overscroll-none" suppressHydrationWarning>
			<body className={cn("bg-white font-sans antialiased", fontSans.variable)}>
				<ContextWrapper>
					<LoadingTransition type="page">{children}</LoadingTransition>
				</ContextWrapper>
				{showToolbar && <VercelToolbar />}
			</body>
		</html>
	);
}

function ContextWrapper({ children }: { children: ReactNode }) {
	const trackingInput = getHeaders();

	return (
		<AuthProvider>
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
		</AuthProvider>
	);
}

function getHeaders() {
	const headersList = nextHeaders();
	const userAgent = headersList.get("user-agent") ?? undefined;
	const embedded = isEmbedded(headersList.get("x-pathname"));

	return { userAgent, embedded };
}
