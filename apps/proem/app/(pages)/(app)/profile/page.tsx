import { getProfileFromUser } from "@/app/(pages)/(app)/profile/getProfileFromUser";
import { ProfileButtons } from "@/app/(pages)/(app)/profile/components/profile-buttons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { currentUser, SignedIn } from "@clerk/nextjs";
import { Privacy } from "@/app/(pages)/(app)/profile/components/privacy";
import { Feedback } from "@/app/(pages)/(app)/profile/components/feedback";

export default async function ProfilePage() {
  const user = await currentUser();
  const { fullName, initials } = getProfileFromUser(user);

  return (
    <>
      <SignedIn>
        <div className="w-full p-4 space-y-4">
          <div className="relative flex flex-col overflow-hidden bg-[#1A1A1A] rounded-sm border border-[#3C3C3C]">
            <div className="absolute inset-0 w-full h-full">
              <div className="w-full h-full bg-pattern-amie animate-backgroundScroll"></div>
            </div>
            <div className="absolute inset-0 w-full h-full"></div>
            <div className="flex items-center w-full h-48 overflow-hidden px-7">
              <div className="relative flex rounded-full shadow-lg">
                <div className="relative flex items-center justify-center transition-all">
                  <div className="absolute top-0 left-0 z-10 flex transition-all duration-200 rounded-full opacity-0 pointer-events-none"></div>
                  <div className="relative overflow-hidden transition-all rounded-full pointer-events-none">
                    <Avatar className="h-[110px] w-[110px]">
                      <AvatarImage src={user?.imageUrl || ""} alt="avatar" />
                      <AvatarFallback className="bg-gray-600">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-between w-full pb-8 pl-8 pr-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1.5">
                  <h4 className="font-sans text-xl font-medium leading-none text-white">
                    {fullName}
                  </h4>
                </div>
                <h4 className="mt-1 font-sans text-sm font-normal leading-none text-white">
                  Registered member
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-sm border border-[#3C3C3C] p-4 divide-y">
            <div className="flex flex-wrap items-center justify-between py-md gap-md">
              <div className="flex">
                <Feedback />
              </div>
              <div className="flex">
                <ProfileButtons />
              </div>
            </div>
          </div>
        </div>
      </SignedIn>

      <Privacy />
    </>
  );
}
