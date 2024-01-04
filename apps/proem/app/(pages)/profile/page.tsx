"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { Button } from "@/app/components/shadcn-ui/button";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const initials = user?.fullName?.split(" ").map((name) => name.charAt(0));

  return (
    <main className="flex flex-col min-h-screen justify-begin">
      <div className="sticky top-0 h-full px-4 py-6 text-xl shadow bg-background">
        Profile
      </div>
      <div className="flex flex-col p-4 pt-8 text-lg font-medium justify-begin items-begin ">
        <div className="flex items-center gap-2 mb-4 justify-begin">
          <Avatar>
            <AvatarImage src={user?.imageUrl || ""} alt="avatar" />
            <AvatarFallback className="bg-gray-600">{initials}</AvatarFallback>
          </Avatar>
          <div>{user?.fullName}</div>
        </div>
        <SignOutButton signOutCallback={() => router.push("/")}>
          <Button className="mt-4">Log out</Button>
        </SignOutButton>
      </div>
    </main>
  );
}
