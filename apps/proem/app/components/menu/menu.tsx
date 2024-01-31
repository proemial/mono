"use client";
import { LOGIN_REDIRECT_URL_PARAM_NAME } from "@/app/components/login/login-drawer";
import { DrawerState, useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import { Bookmark, Home, User } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    icon: Home,
    text: "ASK",
    href: "/?reload=true",
    hasLoginDrawer: false,
  },
  {
    icon: Bookmark,
    text: "READ",
    href: "/feed",
    hasLoginDrawer: false,
  },
  {
    icon: User,
    text: "YOU",
    href: "/profile",
    hasLoginDrawer: true,
  },
] as const;

export function MainMenu() {
  const drawerState = useDrawerState();
  const { userId } = useAuth();

  return (
    <div className="bg-[#1A1A1A] fixed bottom-0 z-50 w-full">
      <div className="flex justify-between w-full max-w-screen-md px-3 py-2 mx-auto">
        {menuItems.map((item) => {
          const { icon: Icon } = item;
          const linkProps = getLinkProps({ userId, ...item, ...drawerState });

          return (
            <Link {...linkProps} key={item.href} className="p-2 cursor-pointer">
              <Icon className="stroke-white" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

type MenuItem =
  | (typeof menuItems)[0]
  | (typeof menuItems)[1]
  | (typeof menuItems)[2];
type WithUserId = { userId: string | null | undefined };
type Props = MenuItem & DrawerState & WithUserId;
function getLinkProps(props: Props): Parameters<typeof Link>[0] {
  const { userId, href, hasLoginDrawer, open, close } = props;

  //  If the user is not signed in, we're open the drawer with a query parameter to handle redirects
  return userId
    ? { href }
    : {
        href: hasLoginDrawer
          ? { query: { [LOGIN_REDIRECT_URL_PARAM_NAME]: href } }
          : href,
        onClick: hasLoginDrawer ? open : close,
      };
}
