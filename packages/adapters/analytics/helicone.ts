import { HeliconeManualLogger } from "@helicone/helpers";
import { idFromCookie } from "./userid";

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

export async function logRetrieval(
	source: string,
	question: string,
	callback: <T>() => Promise<T>,
	traceId?: string,
) {
	const logger = await heliconeLogger({
		traceId: traceId,
		source: source,
		operation: "search",
		sessionName: `${source}: search`,
	});
	return await logger.logRequest(
		{
			_type: "tool",
			toolName: "search",
			input: question,
		},
		async (resultRecorder) => {
			const data = await callback();
			resultRecorder.appendResults({ result: data });

			return data;
		},
	);
}

export async function logHeliconeEvent(
	properties: Properties,
	message: string,
) {
	const logger = await heliconeLogger({
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

export async function heliconeLogger(properties: Properties) {
	return new HeliconeManualLogger({
		apiKey: process.env.HELICONE_API_KEY as string,
		headers: await heliconeHeaders(properties),
	});
}

export async function heliconeHeaders(
	properties: Properties,
): Promise<Record<string, string>> {
	const { id, internal } = (await idFromCookie()) ?? {};

	const headers = {
		"Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
		"Helicone-Property-Project": properties.source,
		"Helicone-Property-Operation": properties.operation,
		"Helicone-Property-Environment": process.env.NODE_ENV || "production",
		"Helicone-Cache-Enabled": "true",
	} as Record<string, string>;

	if (id) headers["Helicone-User-Id"] = id as string;
	if (internal) headers["Helicone-Property-Internal"] = "true";

	return properties.traceId && properties.sessionName
		? {
				...headers,
				"Helicone-Session-Id": properties.traceId,
				"Helicone-Session-Name": properties.sessionName,
				"Helicone-Session-Path": `${properties.source}/${properties.operation}`,
			}
		: headers;
}
