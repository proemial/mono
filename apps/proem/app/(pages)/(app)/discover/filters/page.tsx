import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { Filter } from "./filter";

export default function FiltersPage() {
	return (
		<div className="space-y-6">
			<Feed>
				<Filter rootPath="/discover/filters" />
			</Feed>
		</div>
	);
}
