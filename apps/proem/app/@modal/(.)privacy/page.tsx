"use client";

import Privacy from "@/app/privacy/privacy";
import { PageDrawer } from "@/components/full-page-drawer";

export default function TermsModal() {
	return (
		<PageDrawer title="Privacy policy">
			<Privacy />
		</PageDrawer>
	);
}
