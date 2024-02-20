/**
 * This is a Checkly CLI ApiCheck construct. To learn more, visit:
 * - https://www.checklyhq.com/docs/cli/
 * - https://www.checklyhq.com/docs/cli/constructs-reference/#apicheck
 */

import { ApiCheck, Frequency, RetryStrategyBuilder } from "checkly/constructs";

new ApiCheck("frontpage-ping", {
	name: "frontpage-ping",
	activated: true,
	muted: false,
	shouldFail: false,
	runParallel: true,
	runtimeId: "2023.09",
	locations: ["eu-central-1"],
	frequency: Frequency.EVERY_1H,
	environmentVariables: [],
	maxResponseTime: 20000,
	degradedResponseTime: 5000,
	request: {
		url: "https://proem.ai",
		method: "GET",
		followRedirects: true,
		skipSSL: false,
		assertions: [],
		body: ``,
		bodyType: "NONE",
		headers: [],
		queryParameters: [],
	},
	retryStrategy: RetryStrategyBuilder.linearStrategy({
		baseBackoffSeconds: 60,
		maxRetries: 2,
		maxDurationSeconds: 600,
		sameRegion: true,
	}),
});
