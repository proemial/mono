import { useState } from "react";

const LOCAL_STORAGE_KEY = "proem_post_consent";

type Consent = "accepted" | "denied";

export const usePostConsent = () => {
	const [consent, setConsent] = useState<Consent>("denied");

	const existingConsent = localStorage.getItem(
		LOCAL_STORAGE_KEY,
	) as Consent | null;
	if (existingConsent === "accepted" && consent === "denied") {
		setConsent("accepted");
	}

	const accept = () => {
		localStorage.setItem(LOCAL_STORAGE_KEY, "accepted" satisfies Consent);
		setConsent("accepted");
	};

	return {
		consent,
		accept,
	};
};
