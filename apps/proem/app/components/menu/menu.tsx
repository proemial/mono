"use client";
import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { FeedIcon } from "@/app/components/icons/menu/feed-icon";
import { ReadIcon } from "@/app/components/icons/menu/read-icon";
import { SearchIcon } from "@/app/components/icons/menu/search-icon";
import { UserIcon } from "@/app/components/icons/menu/user-icon";
import { MenuItem } from "@/app/components/menu/menu-item";
import React from "react";

export function MainMenu() {
	return (
		<div className="fixed bottom-0 z-50 w-full">
			<MainMenuUnfixed />
		</div>
	);
}

export function MainMenuUnfixed() {
	return (
		<div className="flex bg-[#1A1A1A] justify-between px-4 mx-auto font-sourceCodePro">
			<MenuItem text="ASK" href="/" track={analyticsKeys.ui.menu.click.ask}>
				<SearchIcon />
			</MenuItem>

			<MenuItem
				text="FEED"
				href="/feed"
				track={analyticsKeys.ui.menu.click.feed}
			>
				<FeedIcon />
			</MenuItem>

			<MenuItem text="READ" href="/oa" track={analyticsKeys.ui.menu.click.read}>
				<ReadIcon />
			</MenuItem>

			<MenuItem
				text="YOU"
				href="/profile"
				track={analyticsKeys.ui.menu.click.you}
				authRequired
			>
				<UserIcon />
			</MenuItem>
		</div>
	);
}
