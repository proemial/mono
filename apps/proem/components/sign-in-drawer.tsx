"use client";

import { FullSizeDrawer } from "@/components/full-page-drawer";
import { SoMeLogo } from "@/components/icons/some-logo";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Button } from "@proemial/shadcn-ui";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { SignInForm } from "./sign-in-form";
import { SignInTerms } from "./sign-in-terms";

const LOGIN_REDIRECT_URL_PARAM_NAME = "redirect_url";

const AUTH_PROVIDERS = [
	{
		oAuthStrategy: "oauth_google",
		name: "Google",
		icon: "google",
	},
	{
		// TODO: Set up and use Clerk's `oauth_x` strategy, instead of styling Twitter as X
		oAuthStrategy: "oauth_twitter",
		name: "X",
		icon: "x",
	},
	{
		oAuthStrategy: "oauth_github",
		name: "GitHub",
		icon: "github",
	},
] as const;

type SignInDrawerProps = {
	trigger: ReactNode;
};

export type SignInState = "idle" | "awaiting-server" | "awaiting-user";

// TODO! consider moving to Clerk elements when out of beta: https://clerk.com/docs/elements/overview
export function SignInDrawer({ trigger }: SignInDrawerProps) {
	const [signInState, setSignInState] = useState<SignInState>("idle");
	const { signIn, isLoaded } = useSignIn();
	const { isLoaded: signUpIsLoaded } = useSignUp();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	if (!isLoaded || !signUpIsLoaded) {
		return;
	}

	return (
		<FullSizeDrawer trigger={trigger}>
			<div className="flex flex-col justify-between h-full py-8 gap-6">
				<div className="text-[24px] text-center">Get started with Proem</div>
				<div className="space-y-8">
					{signInState === "awaiting-user" ? (
						<div>
							<h3>Check your email</h3>
							<p>Use the verification link sent to your email</p>
							<p
								className="underline pt-6 cursor-pointer"
								onClick={() => {
									setSignInState("idle");
								}}
							>
								Use another method
							</p>
						</div>
					) : (
						<>
							<div className="flex flex-col gap-5">
								{AUTH_PROVIDERS.map(({ name, icon, oAuthStrategy }) => {
									return (
										<Button
											key={name}
											disabled={signInState !== "idle"}
											onClick={() => {
												signIn.authenticateWithRedirect({
													strategy: oAuthStrategy,
													redirectUrl: "/sso-callback",
													redirectUrlComplete:
														searchParams.get(LOGIN_REDIRECT_URL_PARAM_NAME) ||
														pathname,
												});
											}}
											className="items-center space-x-2"
										>
											<SoMeLogo variant={icon} />
											<span className="text-xs font-semibold tracking-wider">
												Sign in with {name}
											</span>
										</Button>
									);
								})}
							</div>

							<h3 className="text-center">or</h3>

							<SignInForm
								signInState={signInState}
								setSignInState={setSignInState}
							/>
						</>
					)}
					<SignInTerms />
				</div>
			</div>
		</FullSizeDrawer>
	);
}
