import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DiscoverPage() {
	const { userId } = auth();

	if (userId) {
		redirect(`${routes.space}/${userId}`);
	}

	const filter = {
		features: [],
		days: FEED_DEFAULT_DAYS,
		titles: undefined,
	};

	return <Feed filter={filter} showThemeColors />;
}
