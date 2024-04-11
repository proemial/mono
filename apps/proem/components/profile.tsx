import { ProfileBookmarks } from "@/components/profile-bookmarks";
import { ProfileQuestions } from "@/components/profile-questions";
import { ProfileYou } from "@/components/profile-you";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@proemial/shadcn-ui";
import { Menu } from "lucide-react";

export function Profile() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Menu className="p-1" />
			</SheetTrigger>
			<SheetContent side="left" className="p-4 overflow-y-auto">
				<div className="flex flex-col gap-6">
					<SheetHeader>
						<SheetTitle className="pt-12 text-2xl font-normal">
							Your Profile
						</SheetTitle>
					</SheetHeader>
					<ProfileYou />
					<ProfileQuestions />
					<ProfileBookmarks />
				</div>
			</SheetContent>
		</Sheet>
	);
}
