"use client";
import { SignInState } from "@/components/sign-in-drawer";
import { SignInForm } from "@/components/sign-in-form";
import { SignInTerms } from "@/components/sign-in-terms";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
	const [signInState, setSignInState] = useState<SignInState>("idle");

	const router = useRouter();
	const { isSignedIn } = useAuth();

	useEffect(() => {
		if (isSignedIn) {
			router.replace("/");
		}
	}, [isSignedIn, router]);

	const handleComplete = () => {
		router.replace("/");
	};

	return (
		<div className="min-h-[100dvh] flex flex-col justify-between p-4">
			<div className="mt-24 text-[24px] text-center">Sign in to Proem</div>
			<div className="flex flex-col gap-4 justify-center items-center">
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
					<SignInForm
						signInState={signInState}
						setSignInState={setSignInState}
						onComplete={handleComplete}
						className="w-full flex flex-col gap-2 items-end"
					/>
				)}
			</div>
			<div className="mb-8">
				<SignInTerms />
			</div>
		</div>
	);
}
