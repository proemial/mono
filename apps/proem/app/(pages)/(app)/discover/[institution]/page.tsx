import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { auth } from "@clerk/nextjs/server";
import { FollowButton } from "./follow";
import { OrgSelector } from "./org-selector";

import {
	Branding,
	brandingForInstitution,
} from "@/app/theme/institution-branding";
import { fetchInstitutions } from "@proemial/repositories/oa/institutions/fetch-institutions";
import { getBookmarksByCollectionId } from "../../space/(discover)/get-bookmarks-by-collection-id";

export default async function DiscoverPage({
	params,
}: {
	params: {
		institution: string;
	};
}) {
	const { userId } = auth();
	const { institution: searchString } = params;

	const bookmarks = (await userId)
		? getBookmarksByCollectionId(userId as string)
		: {};

	const institutions = await fetchInstitutions(searchString);
	const institution = institutions?.at(0);
	const institutionName = institution?.display_name ?? searchString;

	const header = (
		<div className="mt-2 flex flex-row justify-between items-center">
			{institution?.works_count?.toLocaleString()} papers published
			<FollowButton id={institution?.id as string} />
		</div>
	);

	const branding = brandingForInstitution(searchString);

	return (
		<>
			<Logo name={institutionName} branding={branding} />

			{institutions?.length > 0 && (
				<Feed
					filter={{ institution: institution?.id }}
					bookmarks={bookmarks}
					theme={branding.theme}
					header={header}
				>
					<OrgSelector institutions={institutions} selected={institutionName} />
				</Feed>
			)}
		</>
	);
}

function Logo({ name, branding }: { name: string, branding: Branding }) {
	if (!branding.logo) return <div className="mb-12 flex justify-center text-xl">{name}</div>;

	// mix-blend-mode works but not on our background https://codepen.io/summercodes/pen/eYaYoVO
	return (
		<div className="mb-8 flex justify-center">
			<img
				src={branding.logo.url}
				alt=""
				className={`max-h-24 max-w-[60%] ${
					branding.logo.whiteOnBlack ? "mix-blend-multiply" : ""
				}`}
			/>
		</div>
	);
	// return (
	// 	<div
	// 		className="h-24 mb-8 bg-contain bg-no-repeat bg-center"
	// 		style={{
	// 			backgroundImage: `url("${branding.logo.url}")`,
	// 		}}
	// 	/>
	// );
}
