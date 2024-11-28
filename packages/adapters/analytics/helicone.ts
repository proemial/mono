import { HeliconeManualLogger } from "@helicone/helpers";

type Properties = {
	source: string;
	operation: string;
	traceId?: string;
	sessionName?: string;
};

// Log the beginning a question to Helicone
export async function logBotBegin(
	source: string,
	question: string,
	traceId?: string,
) {
	return await logHeliconeEvent(
		{
			traceId,
			source,
			operation: "question",
			sessionName: `${source}: answer`,
		},
		question,
	);
}

export async function logHeliconeEvent(
	properties: Properties,
	message: string,
) {
	const logger = heliconeLogger({
		traceId: properties.traceId,
		source: properties.source,
		operation: properties.operation,
		sessionName:
			properties.sessionName ?? `${properties.source}: ${properties.operation}`,
	});
	return await logger.logRequest(
		{
			_type: "tool",
			toolName: properties.operation,
			input: message,
		},
		async (resultRecorder) => {
			resultRecorder.appendResults({ status: "initiated" });
			return "OK";
		},
	);
}

export function heliconeLogger(properties: Properties) {
	return new HeliconeManualLogger({
		apiKey: process.env.HELICONE_API_KEY as string,
		headers: heliconeHeaders(properties),
	});
}

export function heliconeHeaders(
	properties: Properties,
): Record<string, string> {
	const headers = {
		"Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
		"Helicone-Property-Project": properties.source,
		"Helicone-Property-Operation": properties.operation,
		"Helicone-Property-Environment": process.env.NODE_ENV || "production",
	};

	return properties.traceId && properties.sessionName
		? {
				...headers,
				"Helicone-Session-Id": properties.traceId,
				"Helicone-Session-Name": properties.sessionName,
				"Helicone-Session-Path": `${properties.source}/${properties.operation}`,
			}
		: headers;
}
