"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { Button } from "@/app/components/shadcn-ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import * as React from "react";

export default function ProfilePage() {
  const { user } = useUser();
  const initials = user?.name?.split(" ").map((name) => name.charAt(0));

  const handleLogout = () => {
    window.location.href = `/api/auth/logout`;
  };

  return (
    <main className="flex min-h-screen flex-col justify-begin">
      <div className="text-xl px-4 py-6 bg-background h-full top-0 sticky shadow">
        Profile
      </div>
      <div className="p-4 pt-8 flex flex-col justify-begin text-lg font-medium items-begin ">
        <div className="flex justify-begin gap-2 items-center mb-4">
          <Avatar>
            <AvatarImage src={user?.picture || ""} alt="avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>{user?.name}</div>
        </div>
        <Button onClick={handleLogout} className="mt-4">
          Log out
        </Button>
      </div>
    </main>
  );
}
