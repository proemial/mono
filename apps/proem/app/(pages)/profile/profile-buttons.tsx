"use client";
import { Button } from "@/app/components/shadcn-ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function ProfileButtons() {
  const router = useRouter();

  return (
    <SignOutButton signOutCallback={() => router.push("/")}>
      <Button variant="danger">
        <span className="font-sans text-xs font-semibold">Log out</span>
      </Button>
    </SignOutButton>
  );
}
