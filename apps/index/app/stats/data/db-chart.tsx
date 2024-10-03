"use client";
import * as Charts from "recharts";

export default function DbChart({
	data,
}: { data?: { key: string; value: number }[] }) {
	if (!data) {
		return undefined;
	}

	return (
		<Charts.ResponsiveContainer height={600}>
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
				/>
			</Charts.PieChart>
		</Charts.ResponsiveContainer>
	);
}
