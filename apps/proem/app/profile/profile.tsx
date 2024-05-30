import { screenMaxWidth } from "@/app/constants";
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
import { Menu05, XClose } from "@untitled-ui/icons-react";
import dynamic from "next/dynamic";
const ProfileContent = dynamic(
	() =>
		import("@/app/profile/profile-content").then((mod) => mod.ProfileContent),
	{ ssr: false },
);

export function Profile() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					onClick={trackHandler(analyticsKeys.ui.menu.click.open)}
				>
					<Menu05 className="p-1 size-8" />
				</Button>
			</DrawerTrigger>
			<DrawerContent
				className={`${screenMaxWidth} w-full h-full rounded-none mx-auto`}
			>
				<div className="flex flex-col gap-6">
					<DrawerHeader className="pt-0">
						<DrawerTitle className="flex justify-end text-2xl font-normal">
							<DrawerClose asChild>
								<Button
									variant="ghost"
									className="p-0"
									onClick={trackHandler(analyticsKeys.ui.menu.click.close)}
								>
									<XClose className="w-6 h-6" />
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
