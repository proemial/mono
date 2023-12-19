"use client";
import { useSignIn, useUser } from "@clerk/nextjs";
import base64url from "base64url";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
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
  const [accessToken, setAccessToken] = useState(useAccessToken());
  const { user } = useUser();
  const { signIn } = useSignIn();
  const returnTo = window.location.pathname + window.location.search;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    setAccessToken(null);
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
      {isMounted && (
        <Drawer
          isOpen={isOpen || (!!accessToken && !user)}
          onClose={handleClose}
        >
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
                    signIn?.authenticateWithRedirect({
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
              consent to our <Link variant="privacy" /> and{" "}
              <Link variant="terms" />.
            </div>
          </div>
        </Drawer>
      )}
      <Toaster />
    </div>
  );
}

function useAccessToken() {
  const token = useSearchParams().get("token");
  const decoded = base64url.decode(token || "");
  const isValid = decoded?.includes("@");

  return isValid && token;
}

function Link({ variant }: { variant: "privacy" | "terms" }) {
  const url = variant === "privacy" ? "/privacy" : "/terms";
  const text = variant === "privacy" ? "Privacy Policy" : "Terms of Service";

  return (
    <a href={url} className="text-primary-light">
      {text}
    </a>
  );
}
