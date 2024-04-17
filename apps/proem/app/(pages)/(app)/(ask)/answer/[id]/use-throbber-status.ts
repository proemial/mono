"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
	"Analysing question…",
	"Evaluating data sources…",
	"Constructing answer…",
] as const;

export const useThrobberStatus = () => {
	const [message, setMessage] = useState<string>(MESSAGES[0]);

	useEffect(() => {
		(async () => {
			const generator = generateStatusMessage();
			for await (const statusMessage of generator) {
				setMessage(statusMessage);
			}
		})();
	}, []);

	return message;
};

async function* generateStatusMessage() {
	for (const message of MESSAGES) {
		yield message;
		if (message !== MESSAGES[MESSAGES.length - 1]) {
			await new Promise((resolve) =>
				setTimeout(resolve, randomIntervalMs(3000, 5000)),
			);
		}
	}
}

const randomIntervalMs = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);
