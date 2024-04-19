"use client";

import Terms from "@/app/terms/terms";
import { FullPageDrawerWithRouterNavigation } from "@/components/full-page-drawer";

export default function TermsModal() {
	return (
		<FullPageDrawerWithRouterNavigation title="Proemial Terms of Service">
			<Terms />
		</FullPageDrawerWithRouterNavigation>
	);
}
