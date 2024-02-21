import { ApiCheck, AssertionBuilder } from "checkly/constructs";

new ApiCheck("answer-engine-page-api", {
	name: "Proem Answer Engine Page",
	alertChannels: [],
	degradedResponseTime: 10000,
	maxResponseTime: 20000,
	request: {
		url: "https://proem.ai",
		method: "GET",
		followRedirects: true,
		skipSSL: false,
		assertions: [AssertionBuilder.statusCode().equals(200)],
	},
	runParallel: true,
});
