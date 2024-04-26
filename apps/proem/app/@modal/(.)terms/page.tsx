"use client";

import Terms from "@/app/terms/terms";
import { PageDrawer } from "@/components/full-page-drawer";

export default function TermsModal() {
	return (
		<PageDrawer title="Proemial Terms of Service">
			<Terms />
		</PageDrawer>
	);
}
