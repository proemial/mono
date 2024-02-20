import { LoginDrawer } from "@/app/components/login/login-drawer";
import { MainMenu } from "@/app/components/menu/menu";
import { Toaster } from "@/app/components/shadcn-ui/toaster";
import { ShareDrawer } from "@/app/components/share/share-drawer";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
	return (
		<>
			{children}

			<LoginDrawer />
			<ShareDrawer />
			<MainMenu />
			<Toaster />
		</>
	);
}
