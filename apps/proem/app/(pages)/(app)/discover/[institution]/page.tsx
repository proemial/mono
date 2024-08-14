import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { auth } from "@clerk/nextjs/server";
import { FollowButton } from "./follow";
import { OrgSelector } from "./org-selector";

import {
	Branding,
	brandingForInstitution,
} from "@/app/theme/institution-branding";
import { getBookmarksByCollectionId } from "../../space/(discover)/get-bookmarks-by-collection-id";
import { fetchInstitutions } from "@proemial/repositories/oa/institutions/fetch-institutions";

export default async function DiscoverPage({
	params,
}: {
	params: {
		institution: string;
	};
}) {
	const { userId } = auth();
	const { institution } = params;

	const bookmarks = (await userId)
		? getBookmarksByCollectionId(userId as string)
		: {};

	const institutions = await fetchInstitutions(institution);

	const name = institutions?.at(0)?.display_name ?? institution;

	const header = (
		<div className="mt-2 flex flex-row justify-between items-center">
			{institutions?.at(0)?.works_count} papers published
			<FollowButton id={institutions?.at(0)?.id as string} />
		</div>
	);

	const branding = brandingForInstitution(institution);

	return (
		<>
			<Logo branding={branding} />

			{institutions?.length > 0 && (
				<Feed
					filter={{ institution: institutions.at(0)?.id }}
					bookmarks={bookmarks}
					theme={branding.theme}
					header={header}
				>
					<OrgSelector institutions={institutions} selected={name} />
				</Feed>
			)}
		</>
	);
}

function Logo({ branding }: { branding: Branding }) {
	if (!branding.logo) return null;

	// mix-blend-mode works but not on our background https://codepen.io/summercodes/pen/eYaYoVO
	// return (
	// 	<div className="mb-8 flex justify-center">
	// 		<img
	// 			src={branding.logo.url}
	// 			alt=""
	// 			className={`max-h-24 ${
	// 				branding.logo.whiteOnBlack ? "mix-blend-multiply" : ""
	// 			}`}
	// 		/>
	// 	</div>
	// );
	return (
		<div
			className="h-24 mb-8 bg-contain bg-no-repeat bg-center"
			style={{
				backgroundImage: `url("${branding.logo.url}")`,
			}}
		/>
	);
}
