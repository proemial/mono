"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "@proemial/shadcn-ui";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
	const { resolvedTheme } = useTheme();
	const clerkTheme = resolvedTheme === "dark" ? dark : undefined;

	return (
		<ClerkProvider
			appearance={{
				baseTheme: clerkTheme,
			}}
		>
			{children}
		</ClerkProvider>
	);
};
