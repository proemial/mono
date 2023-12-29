"use client";
import { Bookmark } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuthActions } from "@/app/authentication";

export const BookmarksMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { goto, color } = useAuthActions();

      const handleBookmarks = () => {
        goto("/bookmarks");
      };

      return (
        <button type="button" onClick={handleBookmarks}>
          <Bookmark className={color} />
        </button>
      );
    }),
  { ssr: false },
);
