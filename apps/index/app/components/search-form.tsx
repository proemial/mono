"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import dayjs from "dayjs";
import { vectorSpaces } from "@/data/db/vector-spaces";

export function SearchForm() {
	const [query, setQuery] = useState(
		"Women's health encompasses a broad spectrum of topics, including maternal health, contraception, gynecology, and breastfeeding support. Key areas include cesarean outcomes, maternal nutrition, and breast cancer screening, focusing on conditions like urinary infections, cancer patterns, polycystic ovary syndrome, uterine fibroids, and vaginal microbiomes. Hormonal aspects such as estrogen, testosterone effects, menopause, and hormone therapy play a significant role, alongside topics like menstrual health, fertility preservation, family planning, and reproductive rights. Maternal mental health, pregnancy-related issues like prenatal stress and cardiovascular risks, along with lactation and breastfeeding promotion, are also essential areas of focus. Gender bias, norms, and diversity are recurring themes, as well as conditions like endometriosis, vaginal atrophy, vesicovaginal fistulas, and anemia. Other key areas include sexual health, reproductive health, menopause, unintended pregnancy, sleep quality, and gender studies, alongside research on oxytocin, BRCA, fetal programming, and pediatrics.",
	);
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
						defaultValue={(() => {
							const date = dayjs().subtract(7, "day");
							return date.format("YYYY-MM-DD");
						})()}
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
						disabled={pending}
						defaultValue={10}
						min={1}
						max={30}
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
						defaultValue="o3s1536alpha"
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
					defaultValue={query}
					disabled={pending}
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
					onChange={(e) => {
						// You might want to add state for negatedQuery if needed
						// setNegatedQuery(e.target.value);
					}}
				/>
			</div>
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
