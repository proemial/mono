"use client";
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import dayjs from "dayjs";
import { VectorSpaceId, vectorSpaces } from "@/data/db/vector-spaces";
import {
	searchAction,
	SearchMetrics,
	SearchResult,
	QdrantPaper,
} from "../actions/search-action";
import { SearchResult as PaperCard } from "../components/search-result";
import { PaperDetail } from "../components/paper-detail";
export function SearchForm({
	searchInput,
	stats,
}: {
	searchInput?: Record<string, string>;
	stats: { name: string; count: number }[];
}) {
	const [formState, action] = useFormState(searchAction, {} as SearchResult);
	const [selectedPaper, setSelectedPaper] = useState<{
		paper: QdrantPaper;
		summary: string;
	} | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [formCollapsed, setFormCollapsed] = useState(false);

	const { pending } = useFormStatus();

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Collapse form after search result is received, but not while search is running
	useEffect(() => {
		if (formState?.papers?.length) {
			setFormCollapsed(true);
		}
	}, [formState]);

	const handleSelectPaper = (paper: QdrantPaper, summary: string) => {
		setSelectedPaper({ paper, summary });
	};

	const handleCloseDetail = () => {
		setSelectedPaper(null);
	};

	return (
		<div className="max-w-3xl min-h-screen md:min-h-0 mx-auto p-6 rounded-none md:rounded-2xl shadow-xl md:bg-[#181c1f] md:bg-gradient-to-br md:from-[#181c1f] md:via-[#232a36] md:to-[#1a2220] md:border md:border-[#232a36] relative">
			{selectedPaper ? (
				<PaperDetail paper={selectedPaper} onClose={handleCloseDetail} />
			) : (
				<>
					{/* Only collapse the form fields, not the results */}
					{formCollapsed ? (
						<div className="flex flex-col items-center mb-4">
							<button
								onClick={() => {
									setFormCollapsed(false);
								}}
								type="button"
								className="px-4 py-2 bg-green-300 text-black rounded-full font-semibold shadow hover:bg-green-200 transition-all duration-200"
							>
								New Search
							</button>
						</div>
					) : (
						<form
							action={action}
							className="flex flex-col gap-2 md:gap-4"
							// Collapse form on submit only if not pending
							// onSubmit={() => {
							// 	if (!pending) setFormCollapsed(true);
							// }}
						>
							<FormFields
								searchInput={searchInput}
								metrics={formState.metrics}
								stats={stats}
							/>
						</form>
					)}
					{formCollapsed && (
						<div className="w-full flex flex-col md:flex-row md:gap-6">
							<div
								className={`flex-1 ${selectedPaper ? "md:w-1/2" : "w-full"}`}
							>
								{/* Results column */}
								<SearchResults
									results={formState}
									onSelectPaper={handleSelectPaper}
								/>
							</div>
							{/* Desktop: side column INSIDE content area */}
							{/* {selectedPaper && !isMobile && (
							<div className="hidden md:block md:w-1/2 h-full sticky top-0">
								<PaperDetail
									paper={selectedPaper}
									onClose={handleCloseDetail}
								/>
							</div>
						)} */}
						</div>
					)}
					<img
						src="/logo.png"
						alt="Proem logo"
						className="h-8 w-auto absolute bottom-4 right-4 opacity-80 pointer-events-none select-none"
					/>
				</>
			)}
		</div>
	);
}

function SearchResults({
	results,
	onSelectPaper,
}: {
	results: SearchResult;
	onSelectPaper: (paper: QdrantPaper, summary: string) => void;
}) {
	return results?.papers?.map((result, i) => (
		<PaperCard key={i} item={result} onSelect={onSelectPaper} />
	));
}

export function FormFields({
	searchInput,
	metrics,
	stats,
}: {
	searchInput?: Record<string, string>;
	metrics?: SearchMetrics;
	stats: { name: string; count: number }[];
}) {
	const [query, setQuery] = useState(
		searchInput?.query !== undefined
			? searchInput?.query
			: "Verifying claims in LLM-generated content through extraction techniques",
	);
	const [negatedQuery, setNegatedQuery] = useState(
		searchInput?.negatedQuery !== undefined ? searchInput?.negatedQuery : "",
	);
	const [from, setFrom] = useState(
		searchInput?.from || dayjs().subtract(1, "year").format("YYYY-MM-DD"),
	);
	const [count, setCount] = useState(searchInput?.count || 10);
	const [index, setIndex] = useState(searchInput?.index || "o3s1536beta");

	const { pending } = useFormStatus();

	return (
		<>
			<div className="mb-4 text-2xl font-extrabold text-center text-white drop-shadow-sm">
				Search{" "}
				<span className="text-green-300">
					{Number(stats.find((s) => s.name === index)?.count).toLocaleString()}
				</span>{" "}
				research papers <br /> published since 2024-01-01
			</div>

			<input type="hidden" className="md:hidden" name="index" value={index} />
			<input
				type="hidden"
				className="md:hidden"
				name="fullVectorSearch"
				value="false"
			/>
			<div className="flex flex-flex-row mb-2 gap-2 md:gap-4">
				<div className="w-1/2 md:w-1/3">
					<label
						htmlFor="date"
						className="block mb-1 text-sm font-semibold text-green-200"
					>
						Since
					</label>
					<input
						id="from"
						type="date"
						name="from"
						className="w-full p-2 border-2 border-[#2e3a3f] bg-[#181c1f] text-white rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
						disabled={pending}
						defaultValue={from}
						onChange={(e) => {
							setFrom(e.target.value);
						}}
					/>
				</div>
				<div className="w-1/2 md:w-1/3">
					<label
						htmlFor="count"
						className="block mb-1 text-sm font-semibold text-green-200"
					>
						Count
					</label>
					<input
						id="count"
						type="number"
						name="count"
						className="w-full p-2 border-2 border-[#2e3a3f] bg-[#181c1f] text-white rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
						min={1}
						max={30}
						disabled={pending}
						defaultValue={count}
						onChange={(e) => {
							setCount(e.target.value);
						}}
					/>
				</div>
				<div className="md:w-1/3 hidden md:block">
					<label
						htmlFor="fullVectorSearch"
						className="block mb-1 text-sm font-semibold text-green-200"
					>
						Quantization
					</label>
					<select
						id="fullVectorSearch"
						name="fullVectorSearch"
						className="w-full p-2 border-2 border-[#2e3a3f] bg-[#181c1f] text-white rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
						disabled={pending}
					>
						<option value="false">Binary</option>
						<option value="true">Unquantized (Slower, higher accuracy)</option>
					</select>
				</div>
			</div>
			<div className="mb-1">
				<label
					htmlFor="query"
					className="block mb-1 text-sm font-semibold text-green-200"
				>
					Similar to:
				</label>
				<textarea
					id="query"
					name="query"
					rows={6}
					className="w-full p-3 border-2 border-[#2e3a3f] bg-[#181c1f] text-white rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:bg-slate-800"
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
					className="block mb-1 text-sm font-semibold text-green-200"
				>
					Different from:
				</label>
				<textarea
					id="negatedQuery"
					name="negatedQuery"
					rows={2}
					className="w-full p-3 border-2 border-[#2e3a3f] bg-[#181c1f] text-white rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:bg-slate-800"
					placeholder="Enter terms to exclude..."
					disabled={pending}
					defaultValue={negatedQuery}
					onChange={(e) => {
						setNegatedQuery(e.target.value);
					}}
				/>
			</div>
			<div className="flex justify-start items-center gap-2 md:gap-4 mt-2">
				<button
					type="submit"
					disabled={pending}
					className="my-2 px-6 py-2 bg-green-300 text-black rounded-full font-semibold shadow hover:bg-green-200 transition-all duration-200 disabled:bg-[#232a36] disabled:border disabled:border-slate-700 disabled:text-slate-500"
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
