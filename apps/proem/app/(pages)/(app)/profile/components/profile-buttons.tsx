"use client";
import { Button } from "@/app/components/shadcn-ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { Tracker } from "@/app/components/analytics/tracker";

export function ProfileButtons() {
  // TODO: callback from clerk is quirky.
  //  Tracking before redirect breaks redirecting.
  //  Tracking after kinda works, but sometimes throws a console error
  const handleCallback = () => {
    window.location.replace("/");
    Tracker.track(`click:profile-logout`);
  };

  return (
    <SignOutButton signOutCallback={handleCallback}>
      <Button variant="danger">
        <span className="font-sans text-xs font-semibold">Log out</span>
      </Button>
    </SignOutButton>
  );
}
