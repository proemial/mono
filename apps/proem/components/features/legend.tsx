import { FeatureBadge } from "../feature-badges";

export function DebugInfo({
	count,
	className,
}: { count?: number; className?: string }) {
	return (
		<div
			className={`flex justify-between italic text-xs text-gray-400 ${className ?? ""}`}
		>
			<div className="flex">
				<div>
					<FeatureBadge>sum</FeatureBadge>
				</div>
				<div>
					<FeatureBadge variant="topic">topic</FeatureBadge>
				</div>
				<div>
					<FeatureBadge variant="keyword">keyword</FeatureBadge>
				</div>
				<div>
					<FeatureBadge variant="concept">concept</FeatureBadge>
				</div>
				<div>
					<FeatureBadge variant="disabled">skipped</FeatureBadge>
				</div>
			</div>
			<div>
				{Boolean(count) && (
					<div className="mt-1 text-right">{count} matching papers</div>
				)}
			</div>
		</div>
	);
}
