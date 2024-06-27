import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";

export default function BlockedPage() {
	return (
		<>
			<NavBar action={<CloseAction target={routes.home} />} />
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
