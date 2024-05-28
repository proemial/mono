"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

export const SetActiveOrganization = () => {
	const { membership } = useOrganization();
	const { setActive, userMemberships, isLoaded } = useOrganizationList({
		userMemberships: true,
	});

	useEffect(() => {
		if (
			isLoaded &&
			!membership &&
			userMemberships.count === 1 &&
			userMemberships.data[0]
		) {
			const { organization } = userMemberships.data[0];
			void setActive({ organization: organization.id });
		}
	}, [isLoaded, userMemberships, setActive, membership]);

	if (userMemberships?.count && userMemberships.count > 1) {
		console.warn("User has multiple organizations. This is not supported.");
	}

	return undefined;
};
