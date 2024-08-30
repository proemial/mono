import "@/app/globals.css";
import { Analytics } from "@/components/analytics";
import { LoadingTransition } from "@/components/loading-transition";
import { Main } from "@/components/main";
import { NotificationsToaster } from "@/components/notifications-toaster";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReactQueryProvider } from "@/components/providers/react-query";
import { SetActiveOrganization } from "@/components/set-active-organization";
import { TopNavigation } from "@/components/top-navigation/top-navigation";
import { cn } from "@proemial/shadcn-ui";
import { VercelToolbar } from "@vercel/toolbar/next";
import { Metadata, Viewport } from "next";
import { Lato as FontSans } from "next/font/google";
import { headers as nextHeaders } from "next/headers";
import { ReactNode } from "react";
import { screenMaxWidth } from "./constants";
import { isEmbedded } from "@/utils/url";

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
	const headers = getHeaders();

	if (headers.embedded) {
		return <EmbeddedLayout>{children}</EmbeddedLayout>;
	}

	return <MainLayout modal={modal}>{children}</MainLayout>;
}

function MainLayout({ children, modal }: Readonly<Props>) {
	const shouldInjectToolbar = process.env.NODE_ENV === "development";

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
					"min-h-[100dvh] h-full font-sans antialiased max-w-full",
					fontSans.variable,
				)}
			>
				<ContextWrapper>
					<SetActiveOrganization />
					<div className="bg-background group relative">
						<div
							style={{
								boxShadow: "0 0 120px rgba(0, 0, 0, .15)",
							}}
							className={cn(
								"mx-auto min-h-[100dvh] flex flex-col",
								screenMaxWidth,
							)}
						>
							<TopNavigation />

							<LoadingTransition type="page" as={Main}>
								{children}
							</LoadingTransition>

							{modal}
						</div>
					</div>
					<NotificationsToaster />
				</ContextWrapper>
				{shouldInjectToolbar && <VercelToolbar />}
			</body>
		</html>
	);
}
function EmbeddedLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="overscroll-none" suppressHydrationWarning>
			<body>
				<ContextWrapper>
					<LoadingTransition type="page">{children}</LoadingTransition>
				</ContextWrapper>
			</body>
		</html>
	);
}

function ContextWrapper({ children }: { children: ReactNode }) {
	const trackingInput = getHeaders();

	return (
		<AuthProvider>
			<Analytics.PostHog tracking={trackingInput}>
				<ReactQueryProvider>
					{children}
					<Analytics.Clients tracking={trackingInput} />
				</ReactQueryProvider>
			</Analytics.PostHog>
		</AuthProvider>
	);
}

function getHeaders() {
	const headersList = nextHeaders();
	const country = headersList.get("x-country") ?? undefined;
	const region = headersList.get("x-region") ?? undefined;
	const userAgent = headersList.get("user-agent") ?? undefined;
	const embedded = isEmbedded(headersList.get("x-pathname"));

	return { country, region, userAgent, embedded };
}
