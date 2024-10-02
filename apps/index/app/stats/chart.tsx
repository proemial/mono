"use client";
import * as Charts from "recharts";

export default function IngestionChart({
	data,
}: {
	data: {
		ts: string;
		diff: number;
		fetched: number;
		embedded: number;
		upserted: number;
		total: number;
	}[];
}) {
	return (
		<Charts.ResponsiveContainer width="100%" height={600}>
			<Charts.ComposedChart
				width={1000}
				height={600}
				data={data}
				margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
			>
				<Charts.XAxis dataKey="ts" />
				<Charts.YAxis
					label={{ value: "total", position: "insideLeft", angle: 270 }}
				/>
				<Charts.YAxis
					yAxisId="right"
					orientation="right"
					tickFormatter={(v) => `${v}%`}
					label={{ value: "diff", position: "insideRight", angle: 270 }}
				/>
				<Charts.Tooltip />
				<Charts.Legend
					formatter={(value) =>
						value !== "diff" && value !== "total" ? value : ""
					}
				/>
				<Charts.Area
					type="monotone"
					dataKey="total"
					fill="#F0E6D2"
					stroke="#D2B48C"
				/>
				<Charts.Bar dataKey="fetched" barSize={20} fill="#DAA520" />
				<Charts.Bar dataKey="embedded" barSize={20} fill="#CD853F" />
				<Charts.Bar dataKey="upserted" barSize={20} fill="#8B4513" />
				<Charts.Line
					yAxisId="right"
					type="monotone"
					dataKey="diff"
					stroke="#ea0413"
					strokeWidth={2}
				/>
			</Charts.ComposedChart>
		</Charts.ResponsiveContainer>
	);
}
