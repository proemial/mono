import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TanstackWrapper } from "./components/tanstack-wrapper";
import { Analytics } from "@vercel/analytics/react";
import { HighlightInit } from "@highlight-run/next/client";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Index",
	description: "Paper index",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<HighlightInit
				projectId={"odzr874e"}
				serviceName="index"
				tracingOrigins
				networkRecording={{
					enabled: true,
					recordHeadersAndBody: true,
					urlBlocklist: [],
				}}
			/>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased p-4`}
				>
					<TanstackWrapper>{children}</TanstackWrapper>
					<Analytics />
				</body>
			</html>
		</>
	);
}
