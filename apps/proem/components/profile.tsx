import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@proemial/shadcn-ui";
import { ProfileYou } from "@/components/profile-you";
import { Menu05, XClose } from "@untitled-ui/icons-react";
import { screenMaxWidth } from "@/app/constants";

export function Profile() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="sm">
					<Menu05 className="p-1" />
				</Button>
			</DrawerTrigger>
			<DrawerContent className={`${screenMaxWidth} w-full h-full mx-auto rounded-none`}>
				<div className="flex flex-col gap-6">
					<DrawerHeader className="pt-0">
						<DrawerTitle className="flex justify-end text-2xl font-normal">
							<DrawerClose asChild>
								<Button variant="ghost" className="p-0">
									<XClose className="w-6 h-6" />
								</Button>
							</DrawerClose>
						</DrawerTitle>
					</DrawerHeader>
					<div className="px-4">
						<ProfileYou />
					</div>
					{/* <ProfileQuestions />
					<ProfileBookmarks /> */}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
