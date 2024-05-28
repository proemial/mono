import { OrganizationProfile } from "@clerk/nextjs";

/**
 * Note:
 * The `OrganizationProfile` component will redirect to `/`, if the user profile
 * is not an org profile.
 */
export default function OrgManagementPage() {
	return <OrganizationProfile />;
}
