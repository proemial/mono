"use client";

import { User } from "@/components/icons/User";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { trackHandler } from "./analytics/tracking/tracking-keys";

export function UserAvatar({ trackingKey }: { trackingKey?: string }) {
	const { isSignedIn, user, isLoaded } = useUser();
	const showUserAvatar = isSignedIn && isLoaded && user.hasImage;

	if (showUserAvatar) {
		return (
			<Image
				src={user.imageUrl}
				alt=""
				width="24"
				height="24"
				className="rounded-full"
				onClick={() => trackingKey && trackHandler(trackingKey)()}
			/>
		);
	}

	return <User />;
}
