"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
	return <ClerkProvider>{children}</ClerkProvider>;
};
