"use client";

import Terms from "@/app/terms/terms";
import { FullPageDrawer } from "@/components/full-page-drawer";

export default function TermsModal() {
	return (
		<FullPageDrawer title="Proemial Terms of Service">
			<Terms />
		</FullPageDrawer>
	);
}
