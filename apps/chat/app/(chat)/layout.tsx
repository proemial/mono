import { cookies } from "next/headers";

import { AppSidebar } from "@/components/custom/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getSessionId } from "../(auth)/sessionid";

export const experimental_ppr = true;

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sessionId, cookieStore] = await Promise.all([
		getSessionId(),
		cookies(),
	]);
	const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

	return (
		<SidebarProvider defaultOpen={!isCollapsed}>
			<AppSidebar sessionId={sessionId} />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
