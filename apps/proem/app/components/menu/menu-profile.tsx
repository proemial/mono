"use client";
import { User } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuthActions } from "@/app/authentication";

export const ProfileMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { goto, color } = useAuthActions();

      const handleBookmarks = () => {
        goto("/profile");
      };

      return (
        <button type="button" onClick={handleBookmarks}>
          <User className={color} />
        </button>
      );
    }),
  { ssr: false },
);
