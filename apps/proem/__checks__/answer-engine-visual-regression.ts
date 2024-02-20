/**
 * This is a Checkly CLI BrowserCheck construct. To learn more, visit:
 * - https://www.checklyhq.com/docs/cli/
 * - https://www.checklyhq.com/docs/cli/constructs-reference/#browsercheck
 */

import {
	BrowserCheck,
	Frequency,
	RetryStrategyBuilder,
} from "checkly/constructs";

new BrowserCheck("answer-engine-visual-regression", {
	name: "Visual regression testing with snapshots",
	activated: true,
	muted: false,
	shouldFail: false,
	runParallel: true,
	locations: ["eu-central-1"],
	tags: [],
	sslCheckDomain: "",
	frequency: Frequency.EVERY_10M,
	environmentVariables: [],
	code: {
		entrypoint: "./visual-regression-testing-with-snapshots.spec.ts",
	},
	retryStrategy: RetryStrategyBuilder.linearStrategy({
		baseBackoffSeconds: 60,
		maxRetries: 2,
		maxDurationSeconds: 600,
		sameRegion: true,
	}),
});
