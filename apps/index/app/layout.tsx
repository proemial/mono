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
					className={`${geistSans.variable} ${geistMono.variable} antialiased md:p-4 md:m-8 md:bg-slate-100 bg-gradient-to-br from-[#181c1f] via-[#232a36] to-[#1a2220] md:bg-none `}
				>
					<TanstackWrapper>{children}</TanstackWrapper>
					<Analytics />
				</body>
			</html>
		</>
	);
}
