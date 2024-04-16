import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@proemial/shadcn-ui";
import { ProfileYou } from "@/components/profile-you";
import {
	Button,
} from "@proemial/shadcn-ui";
import { Menu } from "lucide-react";
import { X } from "lucide-react";

// TODO: Move max-w-screen-md to constant

export function Profile() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="sm">
					<Menu className="p-1" />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="w-full h-full max-w-screen-md mx-auto rounded-none">
				<div className="flex flex-col gap-6">
					<DrawerHeader className="pt-0">
						<DrawerTitle className="flex justify-end text-2xl font-normal">
							<DrawerClose asChild>
								<Button variant="ghost" className="p-0">
									<X className="w-6 h-6" />
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
