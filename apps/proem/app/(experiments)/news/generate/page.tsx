import { FactsAndQuestions } from "./facts-and-questions";

export default async function GenerateNewsPage() {
	return (
		<div className="flex flex-col gap-4 mb-10 p-3">
			<h1 className="text-center">Annotate News with Science</h1>
			<FactsAndQuestions />
		</div>
	);
}
