"use client";
import { Feed } from "@/app/(pages)/(app)/discover/feed";

export const dynamic = "force-static";

export default function DiscoverPage() {
	return (
		<div className="space-y-6">
			<Feed />
		</div>
	);
}
