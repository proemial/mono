"use client";
import * as Charts from "recharts";

export function PaperCountInIndicesChart({
	data,
}: { data?: { key: string; value: number }[] }) {
	if (!data) {
		return undefined;
	}

	return (
		<Charts.ResponsiveContainer height={300}>
			<Charts.PieChart>
				<Charts.Pie
					data={data}
					dataKey="value"
					nameKey="name"
					cx="50%"
					cy="50%"
					outerRadius={80}
					fill="#8884d8"
					label
					onClick={(entry) => {
						const searchParams = new URLSearchParams(window.location.search);
						searchParams.set("space", entry.key);
						window.location.search = searchParams.toString();
					}}
				>
					{data.map((entry, index) => (
						<Charts.Cell
							key={`cell-${index}`}
							fill={
								[
									"#FF6B6B", // Coral Red
									"#4ECDC4", // Caribbean Green
									"#45B7D1", // Sky Blue
									"#FFA07A", // Light Salmon
									"#98D8C8", // Seafoam Green
									"#F7DC6F", // Maize
									"#BB8FCE", // Light Purple
									"#82E0AA", // Light Green
								][index % 8]
							}
						/>
					))}
				</Charts.Pie>
				<Charts.Tooltip />
				<Charts.Legend
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					formatter={(value, entry) => (entry.payload as any)?.key}
					onClick={(entry) => {
						const searchParams = new URLSearchParams(window.location.search);
						// @ts-ignore
						searchParams.set("space", entry.payload?.key);
						window.location.search = searchParams.toString();
					}}
				/>
			</Charts.PieChart>
		</Charts.ResponsiveContainer>
	);
}

export function PaperCountInLatestIndexChart({
	data,
}: { data?: { key: string; value: number }[] }) {
	if (!data) {
		return undefined;
	}

	return (
		<Charts.ResponsiveContainer width="100%" height={300} className="mt-4">
			<Charts.BarChart data={data}>
				<Charts.CartesianGrid strokeDasharray="3 3" />
				<Charts.XAxis dataKey="key" />
				<Charts.YAxis />
				<Charts.Tooltip />
				<Charts.Bar dataKey="value" fill="#8884d8">
					{data.map((entry, index) => (
						<Charts.Cell key={`cell-${index}`} fill="#4ECDC4" />
					))}
				</Charts.Bar>
			</Charts.BarChart>
		</Charts.ResponsiveContainer>
	);
}
