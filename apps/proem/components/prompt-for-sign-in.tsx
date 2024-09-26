import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";
import { SignInDrawer } from "./sign-in-drawer";

export const PromptForSignIn = ({
	trigger,
	restricted,
}: { trigger: ReactNode; restricted: ReactNode }) => {
	const { isSignedIn } = useAuth();
	if (isSignedIn) {
		return restricted;
	}
	return <SignInDrawer trigger={trigger} />;
};
