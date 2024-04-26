"use client";

import * as React from "react";

import {
	analyticsKeys,
	trackHandler,
} from "@/app/components/analytics/tracking/tracking-keys";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	useTheme,
} from "@proemial/shadcn-ui";

export function ProfileColorSchemeToggle() {
	const { theme, setTheme } = useTheme();

	const handleChange = (value: string) => {
		trackHandler(analyticsKeys.ui.menu.click.theme, { value })();
		setTheme(value);
	};

	return (
		<Select onValueChange={handleChange}>
			<SelectTrigger className="w-20 h-6 p-0 border-0 focus:ring-0 focus:ring-offset-0 capitalize">
				<SelectValue placeholder={theme} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">Light</SelectItem>
				<SelectItem value="dark">Dark</SelectItem>
				<SelectItem value="system">System</SelectItem>
			</SelectContent>
		</Select>
	);
}
