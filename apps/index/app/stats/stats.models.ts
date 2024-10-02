export type IngestionStats = {
	data: Array<IngestionEvent>;
};

export type IngestionEvent = {
	date: string;
	name: IngestionEventName;
	timestamp: string;
	value: number;
};

export type IngestionEventName =
	| "expected"
	| "fetched"
	| "embedded"
	| "upserted";

export type ChartDataPoints = Array<ChartDataPoint>;

export type ChartDataPoint = {
	date: string;
	diff: number;
	fetched: number;
	embedded: number;
	upserted: number;
	total: number;
};
