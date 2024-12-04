import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/custom/theme-provider";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { headers } from "next/headers";

export const metadata: Metadata = {
	metadataBase: new URL("https://chat.proem.ai"),
	title: "Proem Chat",
	description: "Trustworthy answers backed by research",
	icons: [
		{
			rel: "icon",
			url: "/favicon.ico",
			media: "(prefers-color-scheme: light)",
			type: "image/x-icon",
		},
		{
			rel: "icon",
			url: "/favicon-darkmode.ico",
			media: "(prefers-color-scheme: dark)",
			type: "image/x-icon",
		},
		{
			rel: "apple-touch-icon",
			url: "/apple-touch-icon.png",
			sizes: "180x180",
		},
		{
			rel: "icon",
			url: "/android-chrome-192x192.png",
			sizes: "192x192",
			type: "image/png",
		},
		{
			rel: "icon",
			url: "/android-chrome-512x512.png",
			sizes: "512x512",
			type: "image/png",
		},
	],
};

export const viewport = {
	maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const trackingInput = await getHeaders();

	return (
		<html
			lang="en"
			// `next-themes` injects an extra classname to the body element to avoid
			// visual flicker before hydration. Hence the `suppressHydrationWarning`
			// prop is necessary to avoid the React hydration mismatch warning.
			// https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
			suppressHydrationWarning
		>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: THEME_COLOR_SCRIPT,
					}}
				/>
			</head>
			<body className="antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Toaster position="top-center" />

					<Analytics.PostHog tracking={trackingInput}>
						{children}
						<Analytics.Clients tracking={trackingInput} />
					</Analytics.PostHog>
				</ThemeProvider>
			</body>
		</html>
	);
}

async function getHeaders() {
	const headersList = await headers();
	const userAgent = headersList.get("user-agent") ?? undefined;

	return { userAgent };
}
