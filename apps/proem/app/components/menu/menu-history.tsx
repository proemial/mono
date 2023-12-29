"use client";
import { History } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuthActions } from "@/app/authentication";

export const HistoryMenuItem = dynamic(
  () =>
    Promise.resolve(() => {
      const { goto, color } = useAuthActions();

      const handleClick = () => {
        goto("/history");
      };

      return (
        <button type="button" onClick={handleClick}>
          <History className={color} />
        </button>
      );
    }),
  { ssr: false },
);
