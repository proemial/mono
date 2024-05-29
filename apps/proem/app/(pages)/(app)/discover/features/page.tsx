import { FeatureForm } from "./form";

export default async function ReaderInputPage() {
	return (
		<>
			<div className="text-lg font-bold">Feature extraction</div>
			<FeatureForm />
			<div className="mt-2">
				Examples:
				<ul className="list-disc mx-8 my-4">
					<li>https://openalex.org/W4385245566</li>
					<li className="mb-3">W4385245566</li>
					<li>https://arxiv.org/abs/1706.03762</li>
					<li>https://arxiv.org/abs/1706.03762v7</li>
					<li>1706.03762</li>
					<li className="mb-3">1706.03762v7</li>
					<li>https://doi.org/10.48550/arxiv.2306.04526</li>
					<li className="mb-3">10.48550/arxiv.2306.04526</li>
					<li>https://pubmed.ncbi.nlm.nih.gov/37796173</li>
				</ul>
			</div>
		</>
	);
}
