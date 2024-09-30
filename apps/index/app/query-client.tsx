"use client";
import {
	QueryClientProvider,
	QueryClient as ReactQueryClient,
} from "@tanstack/react-query";
import { ReactNode } from "react";

export function QueryClient({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={new ReactQueryClient()}>
			{children}
		</QueryClientProvider>
	);
}
