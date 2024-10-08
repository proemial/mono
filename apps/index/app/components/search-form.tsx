"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import dayjs from "dayjs";
import { vectorSpaces } from "@/data/db/vector-spaces";
import {
	searchAction,
	SearchMetrics,
	SearchResult,
} from "../actions/search-action";
import { SearchResult as PaperCard } from "../components/search-result";

export function SearchForm({
	searchInput,
}: { searchInput?: Record<string, string> }) {
	const [formState, action] = useFormState(searchAction, {} as SearchResult);

	return (
		<form action={action} className="flex flex-col gap-1 mx-2">
			<FormFields searchInput={searchInput} metrics={formState.metrics} />
			<SearchResults results={formState} />
		</form>
	);
}

function SearchResults({
	results,
}: {
	results: SearchResult;
}) {
	return (
		<div className="grid grid-cols-[auto_auto_1fr] gap-4">
			{!!results?.papers?.length && (
				<>
					<div className="font-bold">Score</div>
					<div className="font-bold">Created Date</div>
					<div className="font-bold">Title</div>
					{results?.papers?.map((result, i) => (
						<PaperCard key={i} item={result} />
					))}
				</>
			)}
		</div>
	);
}

export function FormFields({
	searchInput,
	metrics,
}: { searchInput?: Record<string, string>; metrics?: SearchMetrics }) {
	const [query, setQuery] = useState(
		searchInput?.query !== undefined
			? searchInput?.query
			: "Women's health encompasses a broad spectrum of topics, including maternal health, contraception, gynecology, and breastfeeding support. Key areas include cesarean outcomes, maternal nutrition, and breast cancer screening, focusing on conditions like urinary infections, cancer patterns, polycystic ovary syndrome, uterine fibroids, and vaginal microbiomes. Hormonal aspects such as estrogen, testosterone effects, menopause, and hormone therapy play a significant role, alongside topics like menstrual health, fertility preservation, family planning, and reproductive rights. Maternal mental health, pregnancy-related issues like prenatal stress and cardiovascular risks, along with lactation and breastfeeding promotion, are also essential areas of focus. Gender bias, norms, and diversity are recurring themes, as well as conditions like endometriosis, vaginal atrophy, vesicovaginal fistulas, and anemia. Other key areas include sexual health, reproductive health, menopause, unintended pregnancy, sleep quality, and gender studies, alongside research on oxytocin, BRCA, fetal programming, and pediatrics.",
	);
	const [negatedQuery, setNegatedQuery] = useState(
		searchInput?.negatedQuery !== undefined
			? searchInput?.negatedQuery
			: "Challenges and opportunities in developing countries, often referred to as the third world, focusing on economic growth, infrastructure development, education, and healthcare improvements.",
	);
	const [from, setFrom] = useState(
		searchInput?.from || dayjs().subtract(7, "day").format("YYYY-MM-DD"),
	);
	const [count, setCount] = useState(searchInput?.count || 10);
	const [index, setIndex] = useState(searchInput?.index || "o3s1536alpha");

	const { pending } = useFormStatus();

	return (
		<>
			<div className="flex mb-4">
				<div className="w-1/3 mr-2">
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
						defaultValue={from}
						onChange={(e) => {
							setFrom(e.target.value);
						}}
					/>
				</div>
				<div className="w-1/3 mr-2">
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
						min={1}
						max={30}
						disabled={pending}
						defaultValue={count}
						onChange={(e) => {
							setCount(e.target.value);
						}}
					/>
				</div>
				<div className="w-1/3">
					<label
						htmlFor="index"
						className="block mb-1 text-sm font-medium text-gray-700"
					>
						Index
					</label>
					<select
						id="index"
						name="index"
						className="w-full p-2 border rounded"
						disabled={pending}
						defaultValue={index}
						onChange={(e) => {
							setIndex(e.target.value);
						}}
					>
						{Object.keys(vectorSpaces)
							.reverse()
							.map((key, i) => (
								<option key={i} value={key}>
									{vectorSpaces[key]?.collection}
								</option>
							))}
					</select>
				</div>
			</div>
			<div>
				<label
					htmlFor="query"
					className="block mb-1 text-sm font-medium text-gray-700"
				>
					Similar to:
				</label>
				<textarea
					id="query"
					name="query"
					rows={6}
					className="w-full p-2 border rounded disabled:bg-slate-100"
					placeholder="Enter your text here..."
					disabled={pending}
					defaultValue={query}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
				/>
			</div>
			<div>
				<label
					htmlFor="negatedQuery"
					className="block mb-1 text-sm font-medium text-gray-700"
				>
					Different from:
				</label>
				<textarea
					id="negatedQuery"
					name="negatedQuery"
					rows={2}
					className="w-full p-2 border rounded disabled:bg-slate-100"
					placeholder="Enter terms to exclude..."
					disabled={pending}
					defaultValue={negatedQuery}
					onChange={(e) => {
						setNegatedQuery(e.target.value);
					}}
				/>
			</div>
			<div className="flex justify-begin items-center gap-4">
				<button
					type="submit"
					disabled={pending}
					className="my-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-white disabled:border disabled:border-slate-300 disabled:text-slate-300"
				>
					Search
				</button>
				{metrics?.search && (
					<div className="text-sm text-slate-400 italic">
						Elapsed: (Embeddings: {metrics.embeddings}ms , Vector Search:{" "}
						{metrics.search}ms)
					</div>
				)}
			</div>
		</>
	);
}
