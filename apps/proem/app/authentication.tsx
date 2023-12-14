"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname, useRouter } from "next/navigation";
import { useDrawerState } from "@/app/components/login/state";

//
export function useAuthActions() {
  const { push } = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { toggle } = useDrawerState();

  const isHome = pathname === "/";

  const color = "stroke-muted-foreground";

  const toggleDrawer = !user ? toggle : () => {};
  const goto = user ? push : toggleDrawer;

  return { user, goto, toggleDrawer, color, isHome };
}
