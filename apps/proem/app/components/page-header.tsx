"use client";
import { Proem } from "@/app/components/icons/brand/proem";
import { LOGIN_REDIRECT_URL_PARAM_NAME } from "@/app/components/login/login-drawer";
import { useDrawerState } from "@/app/components/login/state";
import { User } from "lucide-react";
import Link from "next/link";

type Props = {
  title?: string;
  isLoggedIn?: boolean;
};

export function PageHeader({ title = "Proem", isLoggedIn = false }: Props) {
  const { open } = useDrawerState();

  return (
    <div className="sticky top-0 z-50 flex flex-row items-center justify-between px-6 py-4 border-b shadow border-neutral-100/20 bg-background">
      <Link href="/">
        <div className="flex flex-row gap-3">
          <Proem />

          <span className="text-lg font-normal tracking-normal"> {title}</span>
        </div>
      </Link>

      {isLoggedIn ? (
        <Link href="/profile">
          <User />
        </Link>
      ) : (
        <Link
          href={{ query: { [LOGIN_REDIRECT_URL_PARAM_NAME]: "profile" } }}
          onClick={open}
        >
          {/* TODO! Improve styling */}
          Login
        </Link>
      )}
    </div>
  );
}
