import { SearchMd } from "@untitled-ui/icons-react";
import Link from "next/link";

export const OpenSearchAction = () => {
	return (
		<Link href="/">
			<div className="p-1">
				<SearchMd className="size-5" />
			</div>
		</Link>
	);
};
