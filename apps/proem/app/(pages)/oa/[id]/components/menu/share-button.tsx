"use client";
import { Forward } from "lucide-react";
import { Tracker } from "@/app//components/analytics/tracker";
import { toast } from "@/app/components/shadcn-ui/toast-hook";

export function ShareButton() {
  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    Tracker.track("click:share", { url: window.location.href });

    toast({
      title: "It's on your clipboard, now go share it 🙏",
    });
  };

  return (
    <button type="button" onClick={() => handleClick()}>
      <Forward />
    </button>
  );
}
