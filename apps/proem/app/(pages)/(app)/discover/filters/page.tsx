import { Feed } from "@/app/(pages)/(app)/discover/feed";
import MultipleSelectorDemo from "./autocomplete";

export default function FiltersPage() {
	return (
		<div className="space-y-6">
			<Feed>
				<MultipleSelectorDemo />
			</Feed>
		</div>
	);
}
