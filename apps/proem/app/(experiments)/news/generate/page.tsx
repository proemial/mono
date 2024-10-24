import { FactsAndQuestions } from "./facts-and-questions";

export default async function GenerateNewsPage() {
	return (
		<div className="flex flex-col gap-4 mb-10 p-3 max-w-3xl mx-auto">
			<h1 className="text-center">Annotate with Science</h1>
			<FactsAndQuestions />
		</div>
	);
}
