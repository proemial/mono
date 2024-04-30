"use client";
import Drawer from "@/app/components/drawer/drawer";
import { Proem } from "@/app/components/icons/brand/proem";
import { SoMeLogo } from "@/components/icons/some-logo";
import { useDrawerState } from "@/app/components/login/state";
import { Button } from "@/app/components/shadcn-ui/button";
import { SignedOut, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const LOGIN_REDIRECT_URL_PARAM_NAME = "redirect_url";

const authProviders = [
	{
		oAuthStrategy: "oauth_google",
		name: "Google",
		icon: "google",
	},
	{
		oAuthStrategy: "oauth_twitter",
		name: "Twitter",
		icon: "twitter",
	},
	{
		oAuthStrategy: "oauth_github",
		name: "GitHub",
		icon: "github",
	},
] as const;

export function LoginDrawer() {
	const { isOpen, close } = useDrawerState();
	const { signIn, isLoaded } = useSignIn();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (!isLoaded) {
		return null;
	}
	return (
		<SignedOut>
			<Drawer isOpen={isOpen} onClose={close} removeWhenClosed={false}>
				<div className="flex flex-col gap-3 p-4 ">
					<div className="flex flex-col justify-center">
						<Proem />
						<div className="mt-3 text-xl font-semibold text-left">
							Get started with Proem
						</div>
					</div>

					{authProviders.map(({ name, icon, oAuthStrategy }) => {
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
								<span className="text-xs font-semibold">
									Continue using {name}
								</span>
							</Button>
						);
					})}

					<div className="text-xs font-normal leading-tight text-left text-gray-500 font-sourceCodePro">
						By using Proem, you consent to our{" "}
						<Link href="/privacy" onClick={close} className="underline ">
							Privacy Policy
						</Link>{" "}
						and{" "}
						<Link href="/terms" onClick={close} className="underline">
							Terms of Service
						</Link>
						.
					</div>
				</div>
			</Drawer>
		</SignedOut>
	);
}
