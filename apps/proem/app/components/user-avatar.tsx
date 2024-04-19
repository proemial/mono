"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { User } from "./icons/user/user";

export function UserAvatar() {
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
			/>
		);
	}

	return <User />;
}
