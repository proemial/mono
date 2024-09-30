"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import dayjs from "dayjs";

export function SearchForm() {
	const [query, setQuery] = useState("");
	const { pending } = useFormStatus();

	return (
		<>
			<div className="flex mb-4">
				<div className="w-1/2 mr-2">
					<label
						htmlFor="date"
						className="block mb-1 text-sm font-medium text-gray-700"
					>
						Since
					</label>
					<input
						id="from"
						type="date"
						name="from"
						className="w-full p-2 border rounded"
						disabled={pending}
						defaultValue={(() => {
							const date = dayjs().subtract(7, "day");
							return date.format("YYYY-MM-DD");
						})()}
					/>
				</div>
				<div className="w-1/2">
					<label
						htmlFor="count"
						className="block mb-1 text-sm font-medium text-gray-700"
					>
						Count
					</label>
					<input
						id="count"
						type="number"
						name="count"
						className="w-full p-2 border rounded"
						disabled={pending}
						defaultValue={10}
					/>
				</div>
			</div>
			<textarea
				name="query"
				rows={4}
				className="w-full p-2 border rounded disabled:bg-slate-100"
				placeholder="Enter your text here..."
				defaultValue={query}
				disabled={pending}
				onChange={(e) => {
					setQuery(e.target.value);
				}}
			/>
			<div>
				<button
					type="submit"
					disabled={pending}
					className="my-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-white disabled:border disabled:border-slate-300 disabled:text-slate-300"
				>
					Search
				</button>
			</div>
		</>
	);
}
