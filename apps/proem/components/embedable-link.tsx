import { Field } from "@/app/data/oa-fields";
import { routes } from "@/routes";
import { isEmbedded, isPaperPage } from "@/utils/url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "./analytics/tracking/tracking-keys";
import { ASSISTANT_OPEN_QUERY_KEY } from "./proem-assistant/use-assistant/use-assistant";

type Props = {
	children: ReactNode;
	path: string;
	spaceId?: string;
	field?: Field | null;
	openAssistant?: boolean;
	feedType?: string;
};

export const EmbedableLink = ({
	children,
	spaceId,
	path,
	field,
	openAssistant,
	feedType = "organic",
}: Props) => {
	const urls = useUrls(path, spaceId, field, openAssistant);
	const trackingKey = useTrackingKey(spaceId);
	const isFeed = trackingKey === analyticsKeys.feed.click.card;

	return (
		<Link
			href={urls.embedUrl ?? urls.pageUrl}
			onClick={trackHandler(trackingKey, isFeed ? { feedType } : undefined)}
			target={urls.embedUrl ? "_blank" : undefined}
		>
			{children}
		</Link>
	);
};

function useUrls(
	path: string,
	spaceId?: string,
	field?: Field | null,
	openAssistant?: boolean,
) {
	const embedUrl = useEmbedUrl(path);
	const pageUrl = usePageUrl(path, spaceId, field, openAssistant);

	return { embedUrl, pageUrl };
}

function usePageUrl(
	path: string,
	spaceId?: string,
	field?: Field | null,
	openAssistant?: boolean,
) {
	const pathname = usePathname();

	const theme =
		// Only add the theme manually if the space is a personal collection
		!spaceId?.includes("col_") && field
			? `?color=${field.theme.color}${
					field.theme.image ? `&image=${field.theme.image}` : ""
				}`
			: "";

	const assistant = openAssistant ? `&${ASSISTANT_OPEN_QUERY_KEY}=true` : "";

	return `${pathname.split("/paper").at(0)}${path}${theme}${assistant}`;
}

function useEmbedUrl(path: string) {
	const pathname = usePathname();
	const embedded = isEmbedded(pathname);
	const baseurl = getBaseUrl();

	if (!embedded) {
		return undefined;
	}
	// TODO: Get from the parent page path
	const source = "femtechinsider";

	return `${baseurl}${routes.space}/${pathname.split("/")[2]}${path}?utm_source=${source}&utm_medium=embed`;
}

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

const getBaseUrl = () =>
	typeof window !== "undefined" && window.location.origin
		? window.location.origin
		: "";
