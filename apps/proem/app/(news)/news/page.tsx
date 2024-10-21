import { FactsAndQuestions } from "./facts-and-questions";

export default async function NewsPage() {
	return (
		<div className="flex flex-col gap-4 mb-10">
			<h1 className="text-center">Anchoring News in Science</h1>
			<FactsAndQuestions />
		</div>
	);
}
