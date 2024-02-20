import { LinkButton } from "./link-button";
// import { BookmarkButton } from "src/components/bookmark-button";
import { ShareButton } from "./share-button";

type Props = {
	id: string;
	url: string;
	className: string;
};

export function ActionsMenu({ url, className }: Props) {
	return (
		<div
			className={`${className} w-full flex justify-between items-center shadow`}
		>
			<LinkButton url={url} />
			<div className="flex gap-4">
				{/*<BookmarkButton id={id} />*/}
				<ShareButton />
			</div>
		</div>
	);
}
