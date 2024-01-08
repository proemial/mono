"use client";
import { Button } from "@/app/components/shadcn-ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function ProfileButtons() {
  const router = useRouter();

  return (
    <SignOutButton signOutCallback={() => router.push("/")}>
      <Button className="mt-4">Log out</Button>
    </SignOutButton>
  );
}
