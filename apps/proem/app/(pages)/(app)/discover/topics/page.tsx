import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { TreeFilter } from "./tree-filter";

export default function DiscoverPage() {
	return (
		<div className="space-y-6">
			<Feed>
				<TreeFilter rootPath="/discover/topics" />
			</Feed>
		</div>
	);
}
