"use client";
import { Tracker } from "@/app//components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { toast } from "@/app/components/shadcn-ui/toast-hook";
import { Forward } from "lucide-react";

export function ShareButton() {
	const handleClick = () => {
		navigator.clipboard.writeText(window.location.href);
		Tracker.track(analyticsKeys.read.click.share, {
			url: window.location.href,
		});

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
