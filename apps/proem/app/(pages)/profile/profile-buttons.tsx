"use client";
import { Button } from "@/app/components/shadcn-ui/button";
import { SignOutButton } from "@clerk/nextjs";

export function ProfileButtons() {
  return (
    <SignOutButton signOutCallback={() => window.location.replace("/")}>
      <Button variant="danger">
        <span className="font-sans text-xs font-semibold">Log out</span>
      </Button>
    </SignOutButton>
  );
}
