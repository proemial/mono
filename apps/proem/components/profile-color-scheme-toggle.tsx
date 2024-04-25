"use client";

import * as React from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	useTheme,
} from "@proemial/shadcn-ui";
import { analyticsKeys, trackHandler } from "@/app/components/analytics/tracking/tracking-keys";

export function ProfileColorSchemeToggle() {
	const { theme, setTheme } = useTheme();

	const handleChange = (value: string) => {
		trackHandler(analyticsKeys.ui.menu.click.theme, { value })();
		setTheme(value);
	}

	return (
		<Select onValueChange={handleChange}>
			<SelectTrigger className="w-20 h-6 p-0 border-0 focus:ring-0 focus:ring-offset-0">
				<SelectValue placeholder="System" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">Light</SelectItem>
				<SelectItem value="dark">Dark</SelectItem>
				<SelectItem value="system">System</SelectItem>
			</SelectContent>
		</Select>
	);
}
