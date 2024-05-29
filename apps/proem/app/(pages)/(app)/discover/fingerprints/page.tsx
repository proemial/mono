import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { Autocomplete } from "./autocomplete";

export default function FiltersPage() {
	return (
		<div className="space-y-6">
			<Feed>
				<Autocomplete />
			</Feed>
		</div>
	);
}
