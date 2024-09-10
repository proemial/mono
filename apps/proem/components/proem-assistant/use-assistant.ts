import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export const useAssistant = () => {
	return useQueryStates({
		["assistant" satisfies typeof ASSISTANT_OPEN_QUERY_KEY]: parseAsBoolean
			.withDefault(false)
			.withOptions({ clearOnDefault: true }),
		["selected" satisfies typeof ASSISTANT_SELECTED_QUERY_KEY]: parseAsString
			.withDefault("")
			.withOptions({ clearOnDefault: true }),
	});
};

export const ASSISTANT_OPEN_QUERY_KEY = "assistant";
export const ASSISTANT_SELECTED_QUERY_KEY = "selected";
