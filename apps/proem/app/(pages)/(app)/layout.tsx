import { LoginDrawer } from "@/app/components/login/login-drawer";
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
		</>
	);
}
