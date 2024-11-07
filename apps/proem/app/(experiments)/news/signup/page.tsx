"use client";
import { AtSign } from "@untitled-ui/icons-react";
import { useState } from "react";

export default function SignupPage() {
	const [success, setSuccess] = useState<boolean>();
	const [error, setError] = useState<string>();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		fetch(
			"https://proem.us9.list-manage.com/subscribe/post?u=f902bd7e8b894181695fc1f5e&amp;id=a1a99e7527&amp;f_id=0007d0e3f0",
			{
				method: "POST",
				mode: "no-cors",
				body: new FormData(form),
			},
		)
			.then(() => {
				console.error("Success!");
				setSuccess(true);
			})
			.catch((err) => {
				console.error("Failed to subscribe:", err);
				setError("Failed to subscribe");
			});
	};

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="flex items-center mt-8 gap-2.5 p-4 rounded-full border border-white w-full"
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

			{error && (
				<div className="font-medium text-red-500 animate-fade-in text-center w-full">
					{error}
				</div>
			)}

			{success && (
				<div className="font-medium text-[#7DFA86] animate-fade-in text-center w-full">
					Thanks for subscribing! We'll be in touch soon.
				</div>
			)}
		</>
	);
}
