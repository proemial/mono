"use client";
import dynamic from "next/dynamic";

const Feed = dynamic(
	() => import("@/app/(pages)/(app)/discover/feed").then((mod) => mod.Feed),
	{
		loading: () => <p>Loading...</p>,
		ssr: false,
	},
);

export default function DiscoverPage() {
	return (
		<div className="space-y-6">
			<Feed />
		</div>
	);
}
