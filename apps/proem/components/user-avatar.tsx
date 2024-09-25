"use client";

import { User as UserIcon } from "@/components/icons/User";
import { UserData } from "@/services/post-service";
import { useUser } from "@clerk/nextjs";
import { cn } from "@proemial/shadcn-ui";
import Image from "next/image";
import { trackHandler } from "./analytics/tracking/tracking-keys";

type Props = {
	authorUserData?: UserData;
	trackingKey?: string;
	className?: string;
};

export function UserAvatar({ authorUserData, trackingKey, className }: Props) {
	const { isSignedIn, user, isLoaded } = useUser();

	// If message has author data, use it with icon fallback
	if (authorUserData) {
		if (authorUserData.imageUrl) {
			return (
				<Image
					src={authorUserData.imageUrl}
					alt=""
					width="24"
					height="24"
					className={cn("rounded-full size-6", className)}
					onClick={() => trackingKey && trackHandler(trackingKey)()}
				/>
			);
		}
		return <UserIcon />;
	}

	// No author data, so the current user is the author
	if (isSignedIn && isLoaded && user.hasImage) {
		return (
			<Image
				src={user.imageUrl}
				alt=""
				width="24"
				height="24"
				className={cn("rounded-full size-6", className)}
				onClick={() => trackingKey && trackHandler(trackingKey)()}
			/>
		);
	}

	return <UserIcon />;
}
