import { Field } from "@/app/data/oa-fields";
import { routes } from "@/routes";
import { isEmbedded } from "@/utils/url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
	analyticsKeys,
	trackHandler,
} from "./analytics/tracking/tracking-keys";

type Props = {
	children: ReactNode;
	path: string;
	spaceId?: string;
	field?: Field | null;
};

export const EmbedableLink = ({ children, spaceId, path, field }: Props) => {
	const baseurl = getBaseUrl();
	const pathname = usePathname();
	const embedded = isEmbedded(pathname);

	const space =
		embedded || (pathname.includes(routes.space) && spaceId)
			? `${routes.space}/${pathname.split("/")[2]}`
			: "";

	const theme =
		// Only add the theme manually if the space is a personal collection
		!space.includes("col_") && field
			? `?color=${field.theme.color}${
					field.theme.image ? `&image=${field.theme.image}` : ""
				}`
			: "";

	return (
		<Link
			href={`${baseurl}${space}${path}${theme}`}
			onClick={trackHandler(analyticsKeys.feed.click.card)}
			target={embedded ? "_blank" : undefined}
		>
			{children}
		</Link>
	);
};

const getBaseUrl = () =>
	typeof window !== "undefined" && window.location.origin
		? window.location.origin
		: "";
