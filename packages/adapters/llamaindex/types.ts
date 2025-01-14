// Type definitions deduced from the LlamaParse API documentation
// https://docs.cloud.llamaindex.ai/API/upload-file-api-v-1-parsing-upload-post

type JobStatus =
	| "PENDING"
	| "SUCCESS"
	| "ERROR"
	| "PARTIAL_SUCCESS"
	| "CANCELLED";

export type JobResponse = {
	id: string;
	status: JobStatus;
	error_code?: string;
	error_message?: string;
};

export type JobResultResponse = {
	markdown: string;
	job_metadata: {
		credits_used: number;
		job_credits_usage: number;
		job_pages: number;
		job_auto_mode_triggered_pages: number;
		job_is_cache_hit: boolean;
		credits_max: number;
	};
};

export type ErrorResponse = {
	detail: string;
};
