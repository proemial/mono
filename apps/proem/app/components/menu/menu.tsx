"use client";
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
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import base64url from "base64url";
import { useUser } from "@auth0/nextjs-auth0/client";

export function MainMenu() {
  const { isOpen, close } = useDrawerState();
  const [accessToken, setAccessToken] = useState(useAccessToken());
  const { user } = useUser();

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
      <div className="pb-4 pt-2">
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
            <div className="flex justify-between items-center my-2">
              <div className="w-2"></div>
              <div className="text-center text-base">
                Please log in to continue
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="border rounded-xl bg-primary border-primary p-1"
              >
                <X className="h-4 w-4 stroke-[4]" />
              </button>
            </div>
            <LoginButton variant="google" />
            <LoginButton variant="twitter" />
            <LoginButton variant="github" />
            <div className="text-xxs text-center text-foreground/70">
              Proemial is a non-profit foundation dedicated to promoting
              academic discourse and knowledge sharing. By using Proem, you
              consent to our <Link variant="privacy" /> and{" "}
              <Link variant="privacy" />.
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

type Props = {
  variant: "google" | "twitter" | "github";
};

function LoginButton({ variant }: Props) {
  const provider =
    variant === "google"
      ? "Google"
      : variant === "twitter"
        ? "Twitter"
        : "GitHub";

  const returnTo = window.location.pathname + window.location.search;

  return (
    <Button
      onClick={() =>
        (window.location.href = `/api/auth/login?returnTo=${returnTo}`)
      }
    >
      <Logo variant={variant} className="mr-2" />
      Continue using {provider}
    </Button>
  );
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
