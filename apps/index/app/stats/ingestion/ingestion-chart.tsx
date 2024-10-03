"use client";
import * as Charts from "recharts";
import { IngestionStats } from "../stats.models";
import { transformData } from "../transform-data";
import { useState } from "react";

type Props = {
	stats: IngestionStats;
};

export default function IngestionChart({ stats }: Props) {
	const [showAll, setShowAll] = useState(true);
	const chartData = transformData(stats, showAll);

	return (
		<>
			<ChartToggle showAll={showAll} setShowAll={setShowAll} />
			<Charts.ResponsiveContainer width="100%" height={600}>
				<Charts.ComposedChart
					data={chartData}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<Charts.XAxis dataKey="date" strokeWidth={2} />
					<Charts.YAxis
						label={{
							value: "total",
							position: "insideLeft",
							angle: 270,
							dy: 40,
							style: { fontWeight: "bold" },
						}}
						domain={[0, "dataMax"]}
						padding={{ top: 20 }}
					/>
					<Charts.YAxis
						yAxisId="right"
						orientation="right"
						tickFormatter={(v) => `${v}%`}
						label={{
							value: "diff",
							position: "insideRight",
							angle: 270,
							fill: "#ea0413",
							style: { fontWeight: "bold" },
						}}
						stroke="#ea0413"
						domain={[0, 100]}
						padding={{ top: 20 }}
						strokeWidth={2}
					/>
					<Charts.Tooltip />
					<Charts.Legend
						formatter={(value) => (value === "diff" ? "diff %" : value)}
					/>
					<Charts.Area
						type="step"
						dataKey="total"
						fill="#F0E6D2"
						stroke="#D2B48C"
					/>
					<Charts.Bar dataKey="fetched" fill="#DAA520" />
					<Charts.Bar dataKey="embedded" fill="#CD853F" />
					<Charts.Bar dataKey="upserted" fill="#8B4513" />
					<Charts.Line
						yAxisId="right"
						type="monotone"
						dataKey="diff"
						stroke="#ea0413"
						label={{
							position: "top",
							formatter: (value: number) => `${value}%`,
							fill: "#ea0413",
							fontSize: 12,
						}}
						strokeWidth={2}
					/>
				</Charts.ComposedChart>
			</Charts.ResponsiveContainer>
		</>
	);
}

function ChartToggle({
	showAll,
	setShowAll,
}: { showAll: boolean; setShowAll: (showAll: boolean) => void }) {
	return (
		<div className="flex justify-center mb-4">
			<div className="flex items-center space-x-4">
				<label>
					<input
						type="radio"
						value="all"
						checked={showAll}
						onChange={() => setShowAll(true)}
						className="mr-1"
					/>
					All
				</label>
				<label>
					<input
						type="radio"
						value="latest"
						checked={!showAll}
						onChange={() => setShowAll(false)}
						className="mr-1"
					/>
					Latest
				</label>
			</div>
		</div>
	);
}
