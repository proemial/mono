"use client";
import { SignedOut, useAuth, useSignIn } from "@clerk/nextjs";
import { Bookmark, History, Home, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Logo } from "../icons/logo";
import Drawer from "../login/drawer";
import { useDrawerState } from "../login/state";
import { Button } from "../shadcn-ui/button";
import { Toaster } from "../shadcn-ui/toaster";
import { Proem } from "../icons/brand/proem";

const REDIRECT_URL = "redirect_url";

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

const menuItems = [
  {
    icon: User,
    href: "/profile",
    hasLoginDrawer: true,
  },
] as const;

export function MainMenuNew() {
  const { isOpen, close, open } = useDrawerState();
  const { signIn, isLoaded: signInIsLoaded } = useSignIn();
  const { userId } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="z-[1000]">
      <div>
        <div
          className="flex justify-around"
          style={{ boxShadow: "0px -8px 8px 4px rgba(0, 0, 0, 0.85)" }}
        >
          {menuItems.map(({ icon: Icon, href, hasLoginDrawer }) => {
            //  If the user is not signed in, we're open the drawer with a query parameter to handle redirects
            const linkProps: Parameters<typeof Link>[0] = userId
              ? { href }
              : {
                href: hasLoginDrawer
                  ? { query: { [REDIRECT_URL]: href } }
                  : href,
                onClick: hasLoginDrawer ? open : close,
              };

            return (
              <Link {...linkProps} key={href}>
                <Icon />
              </Link>
            );
          })}
        </div>
      </div>

      {signInIsLoaded && (
        <SignedOut>
          <Drawer isOpen={isOpen} onClose={close} removeWhenClosed={false}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col justify-center my-2">
                <Proem />
                <div className="mt-3 text-xl text-left font-sans font-semibold">
                  Get started with Proem
                </div>
                {/* <button
                  type="button"
                  onClick={close}
                  className="p-1 border rounded-xl bg-transparent border-transparent"
                >
                  <X className="h-4 w-4 stroke-[3]" />
                </button> */}
              </div>

              {authProviders.map(({ name, icon, oAuthStrategy }) => {
                return (
                  <Button
                    key={name}
                    onClick={() => {
                      signIn.authenticateWithRedirect({
                        strategy: oAuthStrategy,
                        redirectUrl: "/sso-callback",
                        redirectUrlComplete:
                          searchParams.get(REDIRECT_URL) || pathname,
                      });
                    }}
                  >
                    <Logo variant={icon} className="mr-2" />
                    <span className="text-sm font-normal font-sans">Continue using {name}</span>
                  </Button>
                );
              })}

              <div className="text-xs text-left font-normal text-gray-600 leading-tight">
                Proemial is a non-profit foundation dedicated to promoting
                academic discourse and knowledge sharing. By using Proem, you
                consent to our{" "}
                <a href="/privacy" className="text-gray-600 underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-gray-600 underline">
                  Terms of Service
                </a>
                .
              </div>
            </div>
          </Drawer>
        </SignedOut>
      )}

      <Toaster />
    </div>
  );
}
