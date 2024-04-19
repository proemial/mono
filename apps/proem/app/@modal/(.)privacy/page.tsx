"use client";

import Privacy from "@/app/privacy/privacy";
import { FullPageDrawerWithRouterNavigation } from "@/components/full-page-drawer";

export default function TermsModal() {
	return (
		<FullPageDrawerWithRouterNavigation title="Privacy policy">
			<Privacy />
		</FullPageDrawerWithRouterNavigation>
	);
}
