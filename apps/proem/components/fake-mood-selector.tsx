import { SelectContentSelector } from "./select-content-selector";

export const FakeMoodSelector = () => (
	<SelectContentSelector
		selector={[
			{ value: "trending", label: "Trending" },
			{ value: "popular", label: "Popular", disabled: true },
			{ value: "curious", label: "Curious", disabled: true },
		]}
	/>
);
