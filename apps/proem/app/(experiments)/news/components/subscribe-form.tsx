"use client";
import { AtSign } from "@untitled-ui/icons-react";

import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";

import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/components/analytics/tracking/tracker";
import { useIsApp } from "@/utils/app";

const cookieName = "subscribed";

export function SubscribeForm() {
	const isApp = useIsApp();

	const [success, setSuccess] = useState<boolean>();
	const [unsubscribed, setUnsubscribed] = useState(false);

	useEffect(() => {
		console.log("getCookie(cookieName)", !getCookie(cookieName));

		setUnsubscribed(!getCookie(cookieName));
	}, []);

	if (isApp) {
		return null;
	}

	console.log("unsubscribed", unsubscribed);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		form.querySelectorAll("button, input").forEach((el) => {
			(el as HTMLElement).setAttribute("disabled", "true");
		});

		Tracker.track(analyticsKeys.experiments.news.clickSubscribe);
		fetch(
			"https://proem.us9.list-manage.com/subscribe/post?u=f902bd7e8b894181695fc1f5e&amp;id=a1a99e7527&amp;f_id=0007d0e3f0",
			{
				method: "POST",
				mode: "no-cors",
				body: new FormData(form),
			},
		)
			.then(() => {
				setCookie("subscribed", "true", { maxAge: 31536000 });
				setSuccess(true);
			})
			.catch((err) => {
				console.error("Failed to subscribe:", err);
				form.querySelectorAll("button, input").forEach((el) => {
					(el as HTMLElement).removeAttribute("disabled");
				});
			});
	};

	return (
		<>
			{(unsubscribed || success) && (
				<div className="flex flex-col items-center py-16 w-full">
					{unsubscribed && (
						<div className="flex flex-col gap-8 items-center w-full">
							<div className="flex flex-col gap-2 items-center w-full">
								<p className="w-4/5 text-xl font-semibold leading-7 text-center text-white">
									Become beta-tester and get access to our iOS or Android app.
								</p>
							</div>
							<div className="flex gap-2 justify-center items-center w-4/5">
								<form
									onSubmit={handleSubmit}
									className="flex items-center gap-2.5 p-4 rounded-full border border-white w-full"
								>
									<button
										type="submit"
										className="flex items-center justify-center w-6 h-6 text-white"
									>
										<AtSign className="w-full h-full" />
									</button>
									<input
										type="email"
										name="EMAIL"
										placeholder="Your e-mail"
										className="placeholder:text-white/50 w-full text-sm text-white bg-transparent border-none outline-none"
										required
									/>
									<input type="hidden" name="tags" value="15371981" />
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
			)}
		</>
	);
}
