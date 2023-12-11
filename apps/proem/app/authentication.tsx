"use client";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { getCookie, setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useDrawerState } from "@/app/components/login/state";

export function useAuthActions() {
  const { push } = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { toggle } = useDrawerState();

  const status = getStatus(user);
  const isHome = pathname === "/";
  const isWaitlist = pathname === "/waitlist";
  const disableMenu = (isHome || isWaitlist) && !user && status !== "member";

  const color = disableMenu ? "stroke-[#444444]" : "stroke-muted-foreground";

  const toggleDrawer = !user && !disableMenu ? toggle : () => {};
  const goto = user ? push : toggleDrawer;

  return { user, goto, toggleDrawer, status, color, isHome };
}

function getStatus(user?: UserProfile) {
  if (user || getCookie("_ga")) {
    setCookie("status", "member");
    return "member";
  }
  return getCookie("status") as "waitlist" | "member" | undefined;
}
