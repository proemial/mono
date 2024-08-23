"use client";
import { env } from "@/env/client";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignInState } from "./sign-in-drawer";

const formSchema = z.object({
	email: z.string().email(),
});

type Props = {
	signInState: SignInState;
	setSignInState: (state: SignInState) => void;
	onComplete?: () => void;
	className?: string;
};

export function SignInForm({
	signInState,
	setSignInState,
	onComplete,
	className,
}: Props) {
	const { signIn, isLoaded, setActive } = useSignIn();
	const {
		signUp,
		isLoaded: signUpIsLoaded,
		setActive: signUpSetActive,
	} = useSignUp();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	if (!isLoaded || !signUpIsLoaded) {
		console.log("Sign in or sign up is not loaded");
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
				redirectUrl: `${env.NEXT_PUBLIC_VERCEL_URL}/verification`,
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
			// }

			// Check for email link expiry
			if (su.firstFactorVerification.status === "expired") {
				setSignInState("expired");
			}

			if (su.status === "complete") {
				setActive({ session: su.createdSessionId });
				if (onComplete) onComplete();
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
				redirectUrl: `${env.NEXT_PUBLIC_VERCEL_URL}/verification`,
			});

			if (su.status === "complete") {
				signUpSetActive({
					session: su.createdSessionId,
					// beforeEmit: () => router.push("/after-sign-up-path"),
				});
				if (onComplete) onComplete();
				return;
			}
		}
		setSignInState("idle");
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(passwordlessSignInOnSubmit)}
				className="w-full flex flex-col gap-2"
			>
				<div className={className ?? "w-full flex gap-2 items-start"}>
					<FormField
						disabled={signInState !== "idle"}
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full grow">
								<FormControl>
									<Input
										placeholder="Email address…"
										className="grow bg-white "
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="text-xs tracking-wider max-w-[100px]"
						disabled={signInState !== "idle"}
					>
						Continue
					</Button>
				</div>
				{signInState === "expired" && (
					<div className="text-sm text-blue-700 ">
						The link in the verification email has expired. Please try again.
					</div>
				)}
			</form>
		</Form>
	);
}
