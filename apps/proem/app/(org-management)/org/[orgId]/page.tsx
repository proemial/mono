import { OrganizationProfile } from "@clerk/nextjs";
import { InfoCircle } from "@untitled-ui/icons-react";

/**
 * Note:
 * The `OrganizationProfile` component will redirect to `/`, if the user profile
 * is not an org profile.
 */
export default function OrgManagementPage() {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex gap-3 sm:gap-1 items-center">
				<div>
					<InfoCircle className="size-5 opacity-75" />
				</div>
				<div className="text-base/relaxed">
					Members must have signed in once, before they accept an invitation to
					join an organization.
				</div>
			</div>
			<OrganizationProfile routing="hash" />
		</div>
	);
}
