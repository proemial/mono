"use client";
import { LOGIN_REDIRECT_URL_PARAM_NAME } from "@/app/components/login/login-drawer";
import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import { Bookmark, Home, User } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    icon: Home,
    href: "/?reload=true",
    hasLoginDrawer: false,
  },
  // {
  //   icon: History,
  //   href: "/history",
  //   hasLoginDrawer: true,
  // },
  {
    icon: Bookmark,
    href: "/feed",
    hasLoginDrawer: true,
  },
  {
    icon: User,
    href: "/profile",
    hasLoginDrawer: true,
  },
] as const;

export function MainMenu() {
  const { close, open } = useDrawerState();
  const { userId } = useAuth();

  return (
    <div className="bg-[#1A1A1A] fixed bottom-0 z-50 w-full">
      <div className="flex justify-between w-full max-w-screen-md p-3 mx-auto">
        {menuItems.map(({ icon: Icon, href, hasLoginDrawer }) => {
          //  If the user is not signed in, we're open the drawer with a query parameter to handle redirects
          const linkProps: Parameters<typeof Link>[0] = userId
            ? { href }
            : {
                href: hasLoginDrawer
                  ? { query: { [LOGIN_REDIRECT_URL_PARAM_NAME]: href } }
                  : href,
                onClick: hasLoginDrawer ? open : close,
              };

          return (
            <Link {...linkProps} key={href} className="p-2 cursor-pointer">
              <Icon className="stroke-white" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
