"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import dayjs from "dayjs";

export function SearchForm() {
	const [query, setQuery] = useState(
		"'Maternal Health', 'Cesarean Outcomes', 'Maternal Nutrition', 'Contraception', 'Gynecology', 'Breast Cancer Screening', 'Breast cancer', 'Pregnancy', 'Breastfeeding Support', 'Breastfeeding Promotion', 'Urinary Infections', 'Cancer Patterns', 'Breastfeeding', 'Gender Bias', 'Menstrual Health', 'Fertility Preservation', 'Family medicine', 'Breastfeeding', 'Gerontology', 'Mammography', 'Estrogen', 'Breast cancer screening', 'Vaginal atrophy', 'Family planning', 'Quality of life (healthcare)', 'Pregnancy and Mental Health', 'Maternal and Child Undernutrition', 'Hormonal contraception', 'Lactation', 'Vaginal Microbiome', 'Polycystic Ovary Syndrome', 'Breastfeeding', 'Breast Cancer', 'Migraine', 'Breastfeeding Duration', 'Sex steroid', 'Obstetric nursing', 'Menopause', 'Anemia', 'Maternal Mental Health', 'Sleep Quality', 'Prenatal Stress', 'Migraine Prevention', 'Uterine Fibroids', 'Sleep', 'Hormone Therapy', 'Urinary Tract Infections', 'Vaginal flora', 'Gender Norms', 'Contraceptive Use', 'Sleep Studies', 'Polycystic Ovary', 'Migraine', 'Vaginal Microbiome', 'Uterine Conditions', 'Vesicovaginal Fistula', 'Menopausal Health', 'Maternal Mental Health', 'Pelvic Disorders', 'Testosterone Effects', 'Maternal Health', 'Estrogen Signaling', 'Endometriosis', 'Feeding Disorders', 'Gender Bias', 'Soy Isoflavones', 'Human Milk', 'Birth Cohort Study', 'Puberty Regulation', 'Breast Cancer Research', 'Iron Regulation', 'Oxytocin', 'Cardiovascular Pregnancy', 'Sexual Health', 'Polycystic ovary', 'Gender Imbalance', 'BRCA Research', 'Cord lining', 'Gender Diversity', 'Fetal Programming', 'Reproductive Health', 'Pregnancy Intention', 'Obstetrical nursing', 'Umbilical cord', 'Gardnerella vaginalis', 'Pediatrics', 'Unintended pregnancy', 'Lactation', 'Vaginal atrophy', 'Menopause', 'Bacterial vaginosis', 'Genitourinary system', 'Reproductive health', 'Empowerment', 'Reproductive rights', 'Anemia', 'Migraine', 'Hormonal contraception', 'Term (time)', 'Hysterectomy', 'Sex steroid', 'Obstetric nursing', 'Obstetrics', 'Vaginal flora', 'Menstrual cycle', 'Lactobacillus', 'Cord lining', 'Obstetrical nursing', 'Gardnerella vaginalis', 'Gestation', 'Sex hormone-binding globulin', 'Vagina', 'Unintended pregnancy', 'Gender studies'",
	);
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
				rows={15}
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
