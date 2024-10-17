import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { isPaperPage } from "@/utils/url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	path: string;
	spaceId?: string;
};

export const EmbedableLink = ({ children, spaceId, path }: Props) => {
	const trackingKey = useTrackingKey(spaceId);

	return (
		<Link href={path} onClick={trackHandler(trackingKey)} target={"_blank"}>
			{children}
		</Link>
	);
};

function useTrackingKey(spaceId?: string) {
	const pathname = usePathname();
	if (isPaperPage(pathname)) {
		if (spaceId) {
			return analyticsKeys.read.click.spaceCard;
		}
		return analyticsKeys.read.click.relatedCard;
	}
	return analyticsKeys.feed.click.card;
}
