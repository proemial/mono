import { OrganizationProfile } from "@clerk/nextjs";
import { Paragraph } from "@proemial/shadcn-ui";

/**
 * Note:
 * The `OrganizationProfile` component will redirect to `/`, if the user profile
 * is not an org profile.
 */
export default function OrgManagementPage() {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="text-base/relaxed">
				Members must have signed in once, before they accept an invitation to
				join an organization.
			</div>
			<OrganizationProfile />
		</div>
	);
}
