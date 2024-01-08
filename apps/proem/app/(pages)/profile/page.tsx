import { ProfileButtons } from "@/app/(pages)/profile/profile-buttons";
import { PageHeader } from "@/app/components/page-header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { SignedIn, currentUser } from "@clerk/nextjs";

export default async function ProfilePage() {
  const user = await currentUser();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";
  const initials = fullName.split(" ").map((name) => name.charAt(0));

  return (
    <div className="flex flex-col min-h-screen justify-begin">
      <PageHeader>Profile</PageHeader>

      <SignedIn>
        <div className="flex flex-col p-4 pt-8 text-lg font-medium justify-begin items-begin ">
          <div className="flex items-center gap-2 mb-4 justify-begin">
            <Avatar>
              <AvatarImage src={user?.imageUrl || ""} alt="avatar" />
              <AvatarFallback className="bg-gray-600">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>{fullName}</div>
          </div>

          <ProfileButtons />
        </div>
      </SignedIn>
    </div>
  );
}
