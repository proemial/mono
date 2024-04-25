"use client";

import { User } from "@/components/icons/User";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

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

	return (
		<div className="w-6 h-6">
			<User />
		</div>
	);
}
