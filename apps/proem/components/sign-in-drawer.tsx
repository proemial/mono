"use client";

import { SoMeLogo } from "@/app/components/icons/some-logo";
import { LOGIN_REDIRECT_URL_PARAM_NAME } from "@/app/components/login/login-drawer";
import { screenMaxWidth } from "@/app/constants";
import { useSignIn } from "@clerk/nextjs";
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	TableCell,
	TableRow,
} from "@proemial/shadcn-ui";
import { LogIn01, XClose } from "@untitled-ui/icons-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const AUTH_PROVIDERS = [
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

export function SignInDrawer() {
	const { signIn, isLoaded } = useSignIn();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (!isLoaded) {
		return undefined;
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<TableRow>
					<TableCell variant="icon">
						<LogIn01 className="mx-auto size-4" />
					</TableCell>
					<TableCell variant="key" className="cursor-pointer">
						Sign in
					</TableCell>
				</TableRow>
			</DrawerTrigger>
			<DrawerContent
				className={`${screenMaxWidth} w-full h-full rounded-none mx-auto`}
			>
				<div className="flex flex-col gap-2 flex-grow">
					<DrawerHeader className="pt-0">
						<DrawerTitle className="flex justify-between flex-row-reverse text-2xl font-normal items-center">
							<DrawerClose asChild>
								<Button variant="ghost" className="p-0">
									<XClose className="w-6 h-6" />
								</Button>
							</DrawerClose>
						</DrawerTitle>
					</DrawerHeader>
					<div className="p-4 flex flex-col flex-grow justify-between gap-8">
						<div className="flex flex-grow justify-center text-[24px]">
							Get started with Proem
						</div>
						<div className="flex flex-col gap-8">
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
											<span className="text-xs font-semibold">
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
				</div>
			</DrawerContent>
		</Drawer>
	);
}
