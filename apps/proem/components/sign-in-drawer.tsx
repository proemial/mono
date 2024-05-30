"use client";

import { FullSizeDrawer } from "@/components/full-page-drawer";
import { SoMeLogo } from "@/components/icons/some-logo";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@proemial/shadcn-ui";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

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

type Props = {
	trigger: ReactNode;
};

export function SignInDrawer({ trigger }: Props) {
	const { signIn, isLoaded } = useSignIn();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (!isLoaded) {
		return;
	}

	return (
		<FullSizeDrawer trigger={trigger}>
			<div className="flex flex-col justify-between h-full py-8">
				<div className="text-[24px] text-center">Get started with Proem</div>
				<div className="space-y-8">
					<div className="flex flex-col gap-5">
						{AUTH_PROVIDERS.map(({ name, icon, oAuthStrategy }) => {
							return (
								<Button
									key={name}
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
					<div className="text-gray-400 text-sm">
						By using Proem, you consent to our{" "}
						<Link href="/privacy" className="underline">
							Privacy Policy
						</Link>{" "}
						and{" "}
						<Link href="/terms" className="underline">
							Terms of Service
						</Link>
						.
					</div>
				</div>
			</div>
		</FullSizeDrawer>
	);
}
