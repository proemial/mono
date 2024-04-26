import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { SelectContentSelector } from "./select-content-selector";

export const MoodSelector = ({
	trackingPrefix,
}: { trackingPrefix: string }) => (
	<SelectContentSelector
		selector={[
			{ value: "trending", label: "Trending" },
			{ value: "popular", label: "Popular", disabled: true },
			{ value: "curious", label: "Curious", disabled: true },
		]}
		trackingKey={`${trackingPrefix}:${analyticsKeys.chat.click.suggestionsCategory}`}
	/>
);
