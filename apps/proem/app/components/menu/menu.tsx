"use client";
import React from "react";
import { FeedIcon } from "@/app/components/icons/menu/feed-icon";
import { ReadIcon } from "@/app/components/icons/menu/read-icon";
import { SearchIcon } from "@/app/components/icons/menu/search-icon";
import { UserIcon } from "@/app/components/icons/menu/user-icon";
import { MenuItem } from "@/app/components/menu/menu-item";

export function MainMenu() {
  return (
    <div className="bg-[#1A1A1A] fixed bottom-0 z-50 w-full">
      <div className="flex justify-between w-full max-w-screen-md px-3 py-2 mx-auto">
        <MenuItem text="ASK" href="/?reload=true">
          <SearchIcon />
        </MenuItem>

        <MenuItem text="FEED" href="/feed">
          <FeedIcon />
        </MenuItem>

        <MenuItem text="READ" href="/oa">
          <ReadIcon />
        </MenuItem>

        <MenuItem text="YOU" href="/profile" authRequired>
          <UserIcon />
        </MenuItem>
      </div>
    </div>
  );
}
