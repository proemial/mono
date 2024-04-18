"use client";

import Privacy from "@/app/privacy/privacy";
import { FullPageDrawer } from "@/components/full-page-drawer";

export default function TermsModal() {
	return (
		<FullPageDrawer title="Privacy policy">
			<Privacy />
		</FullPageDrawer>
	);
}
