"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { SoMeLogo } from "@/components/icons/some-logo";
import { FullSizeDrawer } from "@/components/full-page-drawer";
import { useSignIn } from "@clerk/nextjs";
import { Button, TableCell, TableRow } from "@proemial/shadcn-ui";
import { LogIn01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const LOGIN_REDIRECT_URL_PARAM_NAME = "redirect_url";

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

export function SignInDrawer() {
	const { signIn, isLoaded } = useSignIn();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (!isLoaded) {
		return;
	}

	return (
		<FullSizeDrawer
			trigger={
				<TableRow>
					<TableCell variant="icon">
						<LogIn01 className="mx-auto size-4" />
					</TableCell>
					<TableCell
						variant="key"
						className="cursor-pointer"
						onClick={trackHandler(analyticsKeys.ui.menu.click.signin)}
					>
						Sign in
					</TableCell>
				</TableRow>
			}
		>
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
