import IngestionChart from "./chart";

const data = [
	{
		ts: "25/09",
		diff: 0,
		fetched: 2400,
		embedded: 2400,
		upserted: 2400,
		total: 2400,
	},
	{
		ts: "26",
		diff: 8,
		fetched: 1398,
		embedded: 1300,
		upserted: 1300,
		total: 1398,
	},
	{
		ts: "27",
		diff: 0,
		fetched: 9800,
		embedded: 9800,
		upserted: 9800,
		total: 9800,
	},
	{
		ts: "28",
		diff: 100,
		fetched: 3908,
		embedded: 0,
		upserted: 0,
		total: 3908,
	},
	{
		ts: "29",
		diff: 0,
		fetched: 4800,
		embedded: 4800,
		upserted: 4800,
		total: 4800,
	},
	{
		ts: "30",
		diff: 0,
		fetched: 3800,
		embedded: 3800,
		upserted: 3800,
		total: 3800,
	},
	{
		ts: "1/10",
		diff: 0,
		fetched: 4300,
		embedded: 4300,
		upserted: 4300,
		total: 4300,
	},
];

type Stats = {
	date: string;
	name: "expected" | "fetched" | "embedded" | "upserted";
	timestamp: string;
	value: number;
};

type ChartData = {
	date: string;
	diff: number;
	fetched: number;
	embedded: number;
	upserted: number;
	total: number;
};

export default async function StatsPage() {
	// const response = await fetch(
	// 	"https://api.eu-central-1.aws.tinybird.co/v0/pipes/ingestLog_pipe_5053.json?token=p.eyJ1IjogIjZmZjkyNzRjLTU0YjMtNGUyZi04N2JhLWMzZjgwZTBlMjE3NyIsICJpZCI6ICIwMWFkNmMyYy00M2FhLTRiZTEtYTczZC1kMDFiY2UxMjI4NjYiLCAiaG9zdCI6ICJhd3MtZXUtY2VudHJhbC0xIn0.Yuq--AVBOvL-2CawnfOR_HLkZqZjXOqgmUFfRgp3gk4",
	// );
	// const json = (await response.json()).data as Stats[];
	// console.log(json.length);

	// const chartData = [] as ChartData[];
	// json
	// 	.filter(({ name }) => name !== "expected")
	// 	.forEach(({ date, name, value }) => {
	// 		const existing = chartData.find(({ date: d }) => d === date);
	// 		// if (existing) {
	// 		// 	existing[name] = value;
	// 		// } else {
	// 		// 	chartData.push({ date, ...{ fetched: 0, embedded: 0, upserted: 0 } });
	// 		// }
	// 	});

	return (
		<>
			<div className="mb-4 text-3xl font-bold text-center">Ingestion stats</div>
			<IngestionChart data={data} />
		</>
	);
}
