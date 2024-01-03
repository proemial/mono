"use client";
import { useSignIn } from "@clerk/nextjs";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "../icons/logo";
import Drawer from "../login/drawer";
import { useDrawerState } from "../login/state";
import { Button } from "../shadcn-ui/button";
import { Toaster } from "../shadcn-ui/toaster";
import { BookmarksMenuItem } from "./menu-bookmarks";
import { HistoryMenuItem } from "./menu-history";
import { HomeMenuItem } from "./menu-home";
import { ProfileMenuItem } from "./menu-profile";
import { getLocation } from "@/app/utils/url";

const authProviders = [
  {
    oAuthStrategy: "oauth_google",
    name: "Google",
    icon: "google",
  },
  {
    oAuthStrategy: "oauth_twitter",
    name: "Twitter",
    icon: "twitter",
  },
  {
    oAuthStrategy: "oauth_github",
    name: "GitHub",
    icon: "github",
  },
] as const;

export function MainMenu() {
  const { isOpen, close } = useDrawerState();
  const { signIn, isLoaded: signInIsLoaded } = useSignIn();

  const returnTo = getLocation();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    close();
  };

  return (
    <div className="z-[1000]">
      <div className="pt-2 pb-4">
        <div
          className="flex justify-around"
          style={{ boxShadow: "0px -8px 8px 4px rgba(0, 0, 0, 0.85)" }}
        >
          <HomeMenuItem />
          <HistoryMenuItem />
          <BookmarksMenuItem />
          <ProfileMenuItem />
        </div>
      </div>
      {isMounted && signInIsLoaded && (
        <Drawer isOpen={isOpen} onClose={handleClose}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between my-2">
              <div className="w-2"></div>
              <div className="text-base text-center">
                Please log in to continue
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 border rounded-xl bg-primary border-primary"
              >
                <X className="h-4 w-4 stroke-[4]" />
              </button>
            </div>

            {authProviders.map(({ name, icon, oAuthStrategy }) => {
              return (
                <Button
                  key={name}
                  onClick={() => {
                    signIn.authenticateWithRedirect({
                      strategy: oAuthStrategy,
                      redirectUrl: returnTo,
                      redirectUrlComplete: returnTo,
                    });
                  }}
                >
                  <Logo variant={icon} className="mr-2" />
                  Continue using {name}
                </Button>
              );
            })}

            <div className="text-center text-xxs text-foreground/70">
              Proemial is a non-profit foundation dedicated to promoting
              academic discourse and knowledge sharing. By using Proem, you
              consent to our{" "}
              <a href="/privacy" className="text-primary-light">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-primary-light">
                Terms of Service
              </a>
              .
            </div>
          </div>
        </Drawer>
      )}
      <Toaster />
    </div>
  );
}
