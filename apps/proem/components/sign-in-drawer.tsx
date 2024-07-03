"use client";

import { FullSizeDrawer } from "@/components/full-page-drawer";
import { SoMeLogo } from "@/components/icons/some-logo";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Input,
} from "@proemial/shadcn-ui";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
	email: z.string().email(),
});

export function SignInDrawer({ trigger }: SignInDrawerProps) {
	const [signInState, setSignInState] = useState<
		"idle" | "awaiting-server" | "awaiting-user"
	>("idle");
	const { signIn, isLoaded, setActive } = useSignIn();
	const {
		signUp,
		isLoaded: signUpIsLoaded,
		setActive: signUpSetActive,
	} = useSignUp();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	if (!isLoaded || !signUpIsLoaded) {
		return;
	}
	async function passwordlessSignInOnSubmit({
		email,
	}: z.infer<typeof formSchema>) {
		if (!signIn || !signUp) return;
		setSignInState("awaiting-server");

		try {
			// Try to sign in with the user and default to an signup if the user doesn't exist
			const { startEmailLinkFlow } = signIn.createEmailLinkFlow();

			const si = await signIn.create({
				identifier: email,
			});

			// @ts-expect-error wrong type
			const { emailAddressId } = si.supportedFirstFactors.find(
				(ff) => ff.strategy === "email_link" && ff.safeIdentifier === email,
			);

			setSignInState("awaiting-user");
			const su = await startEmailLinkFlow({
				emailAddressId: emailAddressId,
				redirectUrl: "http://localhost:4242/verification",
			});
			// TODO: add expired and verified states
			// const verification = su.firstFactorVerification;
			// if (verification.verifiedFromTheSameClient()) {
			// 	// setVerified(true);
			// 	// If you're handling the verification result from
			// 	// another route/component, you should return here.
			// 	// See the <Verification/> component as an
			// 	// example below.
			// 	// If you want to complete the flow on this tab,
			// 	// don't return. Simply check the sign in status.
			// 	// return;
			// } else if (verification.status === "expired") {
			// 	// setExpired(true);
			// }

			if (su.status === "complete") {
				setActive({ session: su.createdSessionId });
				return;
			}
		} catch (error) {
			console.log(error);

			const { startEmailLinkFlow } = signUp.createEmailLinkFlow();

			await signUp.create({
				emailAddress: email,
			});

			setSignInState("awaiting-user");
			const su = await startEmailLinkFlow({
				redirectUrl: `${process.env.NEXT_PUBLIC_VERCEL_URL}/verification`,
			});

			if (su.status === "complete") {
				signUpSetActive({
					session: su.createdSessionId,
					// beforeEmit: () => router.push("/after-sign-up-path"),
				});
				return;
			}
		}
		setSignInState("idle");
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

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(passwordlessSignInOnSubmit)}
									className="flex gap-2 items-start"
								>
									<FormField
										disabled={signInState !== "idle"}
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem className="grow">
												<FormControl>
													<Input
														placeholder="Email address…"
														className="grow bg-white dark:bg-neutral-600"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="submit"
										className="text-xs tracking-wider"
										disabled={signInState !== "idle"}
									>
										Continue
									</Button>
								</form>
							</Form>
						</>
					)}
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
