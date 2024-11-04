"use client";
import { AtSign } from "@untitled-ui/icons-react";

import { useState } from "react";

import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

export function SubscribeForm() {
	const [success, setSuccess] = useState(false);

	return (
		<>
			<div className="flex flex-col items-center py-16 w-full">
				{!success && (
					<div className="flex flex-col gap-8 items-center w-full">
						<div className="flex flex-col gap-2 items-center w-full">
							<p className="w-4/5 text-xl font-semibold leading-7 text-center text-white">
								Become beta-tester and get access to our iOS or Android app.
							</p>
						</div>
						<div className="flex gap-2 justify-center items-center w-4/5">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									setSuccess(true);
								}}
								className="flex items-center gap-2.5 p-4 rounded-full border border-white w-full"
							>
								<AtSign className="w-6 h-6 text-white" />
								<input
									type="email"
									placeholder="Your e-mail"
									className="placeholder:text-white/50 w-full text-sm text-white bg-transparent border-none outline-none"
								/>
							</form>
						</div>
					</div>
				)}
				{success && (
					<div className="font-medium text-[#7DFA86] animate-fade-in text-center w-full">
						Thanks for subscribing! We'll be in touch soon.
					</div>
				)}
			</div>
		</>
	);
}
