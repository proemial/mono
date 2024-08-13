"use client";

import { Throbber } from "@/components/throbber";
import { useClerk } from "@clerk/nextjs";
import { EmailLinkErrorCode, isEmailLinkError } from "@clerk/nextjs/errors";
import { useEffect, useState } from "react";

// Handle email link verification results. This is
// the final step in the email link flow.
export default function VerificationPage() {
	const [verificationStatus, setVerificationStatus] = useState("loading");

	const { handleEmailLinkVerification } = useClerk();

	useEffect(() => {
		async function verify() {
			try {
				await handleEmailLinkVerification({
					redirectUrl: "/",
					redirectUrlComplete: "/",
				});
				// If we're not redirected at this point, it means
				// that the flow has completed on another device.
				setVerificationStatus("verified");
			} catch (err) {
				if (err instanceof Error) {
					// Verification has failed.
					let status = "failed";
					if (
						isEmailLinkError(err) &&
						err.code === EmailLinkErrorCode.Expired
					) {
						status = "expired";
					}
					setVerificationStatus(status);
				}
			}
		}
		verify();
	}, []);

	if (verificationStatus === "loading") {
		return <div>Loading...</div>;
	}

	if (verificationStatus === "failed") {
		return <div>Email link verification failed</div>;
	}

	if (verificationStatus === "expired") {
		return <div>Email link expired</div>;
	}

	return (
		<div className="min-h-[100dvh] flex flex-col gap-4 justify-center items-center">
			<div>Successfully signed in. Forwarding you to proem...</div>
			<Throbber />
		</div>
	);
}
