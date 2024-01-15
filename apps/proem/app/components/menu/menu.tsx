"use client";
import { LOGIN_REDIRECT_URL_PARAM_NAME } from "@/app/components/login/login-drawer";
import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import { Bookmark, History, Home, User } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    icon: Home,
    href: "/?reload=true",
    hasLoginDrawer: false,
  },
  {
    icon: History,
    href: "/history",
    hasLoginDrawer: true,
  },
  {
    icon: Bookmark,
    href: "/bookmarks",
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
    <div className="pt-2 pb-4 z-[1000]">
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
                ? { query: { [LOGIN_REDIRECT_URL_PARAM_NAME]: href } }
                : href,
              onClick: hasLoginDrawer ? open : close,
            };

          return (
            <Link {...linkProps} key={href}>
              <Icon className="stroke-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
