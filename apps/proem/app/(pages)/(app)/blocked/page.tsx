import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Main } from "@/components/main";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";

export default function BlockedPage() {
	const { isInternal } = getInternalUser();

	return (
		<>
			<NavBarV2 isInternalUser={isInternal} />
			<Main>
				<div className="flex flex-col flex-grow justify-center -mt-[60px]">
					<h1>Request blocked</h1>
					<p>
						We're receiving too much traffic from your location. Please try
						again in a few minutes.
					</p>
				</div>
			</Main>
		</>
	);
}
