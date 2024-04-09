import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ProfileYou } from "@/components/profile-you"
import { ProfileQuestions } from "@/components/profile-questions"
import { ProfileBookmarks } from "@/components/profile-bookmarks"

export function Profile() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Menu className="p-1" />
            </SheetTrigger>
            <SheetContent side="left" className="p-4 overflow-y-auto">
                <div className="flex flex-col gap-6">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-normal pt-12">Your Profile</SheetTitle>
                    </SheetHeader>
                    <ProfileYou />
                    <ProfileQuestions />
                    <ProfileBookmarks />
                </div>
            </SheetContent>
        </Sheet>
    )
}
