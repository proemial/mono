"use client";
import { Main } from "@/components/main";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { SignInState } from "@/components/sign-in-drawer";
import { SignInForm } from "@/components/sign-in-form";
import { SignInTerms } from "@/components/sign-in-terms";
import { useAuth } from "@clerk/nextjs";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@proemial/shadcn-ui";
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
		<>
			<NavigationMenu>
				<NavigationMenuList className="justify-center flex-nowrap">
					<NavigationMenuItem className="truncate">
						<SimpleHeader title="Sign in" />
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<Main>
				<div className="h-full flex flex-col justify-center space-y-6">
					<div className="min-h-[33dvh] flex flex-col gap-4 justify-center items-center">
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
					<SignInTerms />
				</div>
			</Main>
		</>
	);
	// 	return (
	// 		<div className="min-h-[100dvh] flex flex-col gap-4 justify-center items-center">
	// 			<SignInForm />
	// 		</div>
	// 	);
}
