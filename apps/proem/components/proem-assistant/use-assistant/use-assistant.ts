import { parseAsBoolean, useQueryState } from "nuqs";
import { useAssistantState } from "./assistant-state";

export const useAssistant = () => {
	// nuqs gives us type-safe search params and state management
	const [isAssistantOpened, setIsAssistantOpened] = useQueryState(
		"assistant" satisfies typeof ASSISTANT_OPEN_QUERY_KEY,
		parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
	);
	const [selectedTupleId, setSelectedTupleId] = useQueryState(
		"selected" satisfies typeof ASSISTANT_SELECTED_QUERY_KEY,
		{
			defaultValue: "",
			clearOnDefault: true,
		},
	);

	const {
		expanded: isAssistantExpanded,
		setExpanded: setIsAssistantExpanded,
		inputFocused: isAssistantInputFocused,
		setInputFocused: setIsAssistantInputFocused,
	} = useAssistantState();

	const openAssistant = () => setIsAssistantOpened(true);
	const closeAssistant = () => setIsAssistantOpened(false);
	const expandAssistant = () => setIsAssistantExpanded(true);
	const collapseAssistant = () => setIsAssistantExpanded(false);
	const focusAssistantInput = () => setIsAssistantInputFocused(true);
	const blurAssistantInput = () => setIsAssistantInputFocused(false);

	return {
		isAssistantOpened,
		openAssistant,
		closeAssistant,
		selectedTupleId,
		isAssistantExpanded,
		expandAssistant,
		collapseAssistant,
		isAssistantInputFocused,
		focusAssistantInput,
		blurAssistantInput,
	};
};

export const ASSISTANT_OPEN_QUERY_KEY = "assistant";
export const ASSISTANT_SELECTED_QUERY_KEY = "selected";
