import Link from "next/link";

export function SignInTerms() {
	return (
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
	);
}
