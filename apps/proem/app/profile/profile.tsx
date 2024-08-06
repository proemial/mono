import { screenMaxWidth } from "@/app/constants";
import { MenuButton } from "@/app/profile/menu-button";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@proemial/shadcn-ui";
import { XClose } from "@untitled-ui/icons-react";
import dynamic from "next/dynamic";
const ProfileContent = dynamic(
	() =>
		import("@/app/profile/profile-content").then((mod) => mod.ProfileContent),
	{ ssr: false },
);

export function Profile() {
	return (
		<Drawer>
			<DrawerTrigger>
				<MenuButton asChild />
			</DrawerTrigger>
			<DrawerContent className={`${screenMaxWidth} h-dvh rounded-none mx-auto`}>
				<div className="flex flex-col h-full overflow-y-auto gap-6">
					<DrawerHeader className="pt-0">
						<DrawerTitle className="flex justify-end text-2xl font-normal">
							<DrawerClose>
								<Button
									asChild
									variant="ghost"
									className="p-0"
									onClick={trackHandler(analyticsKeys.ui.menu.click.close)}
								>
									<div>
										<XClose className="size-6" />
									</div>
								</Button>
							</DrawerClose>
						</DrawerTitle>
					</DrawerHeader>

					<ProfileContent />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
