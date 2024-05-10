"use client";
import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { OaFields } from "@proemial/models/open-alex-fields";
import { useSearchParams } from "next/navigation";

export default function DiscoverPage() {
	const searchParams = useSearchParams();
	const topic = searchParams.get("topic") ?? "";

	const fieldId = OaFields.find(
		(c) =>
			c.display_name.toLowerCase() === decodeURI(topic).replaceAll("%2C", ","),
	)?.id;

	return (
		<div className="space-y-6">
			<Feed fieldId={fieldId} />
		</div>
	);
}
