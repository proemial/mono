"use client";
import Drawer from "@/app/components/drawer/drawer";
import { Proem } from "@/app/components/icons/brand/proem";
import { Logo } from "@/app/components/icons/logo";
import { useDrawerState } from "@/app/components/login/state";
import { Button } from "@/app/components/shadcn-ui/button";
import { SignedOut, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const LOGIN_REDIRECT_URL_PARAM_NAME = "redirect_url";

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

export function LoginDrawer() {
  const { isOpen, close } = useDrawerState();
  const { signIn, isLoaded } = useSignIn();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!isLoaded) {
    return null;
  }
  return (
    <SignedOut>
      <Drawer isOpen={isOpen} onClose={close} removeWhenClosed={false}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col justify-center my-2">
            <Proem />
            <div className="mt-3 font-sans text-xl font-semibold text-left">
              Get started with Proem
            </div>
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
                      searchParams.get(LOGIN_REDIRECT_URL_PARAM_NAME) ||
                      pathname,
                  });
                }}
                className="items-center space-x-2"
              >
                <Logo variant={icon} />
                <span className="font-sans text-xs font-semibold">
                  Continue using {name}
                </span>
              </Button>
            );
          })}

          <div className="text-xs font-normal leading-tight text-left text-gray-600">
            By using Proem, you consent to our{" "}
            <Link
              href="/privacy"
              onClick={close}
              className="text-gray-600 underline"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              onClick={close}
              className="text-gray-600 underline"
            >
              Terms of Service
            </Link>
            .
          </div>
        </div>
      </Drawer>
    </SignedOut>
  );
}
