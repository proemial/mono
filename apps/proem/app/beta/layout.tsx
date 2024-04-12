import { cn } from "@/app/components/shadcn-ui/utils";
import { NavigationMenuBar } from "@/components/navigation-menu-bar";
import { ThemeProvider } from "@proemial/shadcn-ui";
import type { Metadata, Viewport } from "next";
import { Lato as FontSans } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="overscroll-none" suppressHydrationWarning>
			{
				<body
					className={cn(
						"min-h-screen h-full bg-background font-sans antialiased max-w-full",
						fontSans.variable,
					)}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="flex flex-col w-full max-w-screen-md mx-auto">
							<NavigationMenuBar />
							{children}
						</div>
					</ThemeProvider>
				</body>
			}
		</html>
	);
}
