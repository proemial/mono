"use client";
import React, { useEffect, useState } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export function ShowOnboarding() {
	// Default true to avoid showing onboarding before the cookie is read
	const [closed, setClosed] = useState<boolean>(true);
	useEffect(() => {
		setClosed(!!getCookie("onboardingClosed"));
	}, []);

	if (!closed) return undefined;

	// reset cookie
	const handleOpen = () => {
		setClosed(false);
		deleteCookie("onboardingClosed");
		location.reload(); 
		return false;
	};

	return (
		<div onClick={handleOpen}>About Proem</div>
	);
}
