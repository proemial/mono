import { Concepts } from "@/app/components/card/concepts";
import { FeatureKey } from "@/app/components/feature-flags/features";
import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";

type Props = {
	data: OpenAlexWorkMetadata;
	flags: { [key in FeatureKey]: boolean };
};

export default function CardFooter({ data, flags }: Props) {
	return (
		<>
			{flags.showMainTopicInCards && (
				<div className="text-xs leading-4 text-white/80 font-sourceCodePro">
					{data.topics?.length && data.topics.at(0)?.display_name}
				</div>
			)}
			{flags.showSubfieldInCards && (
				<div className="text-xs text-white/50">
					{data.topics?.length && data.topics.at(0)?.subfield?.display_name}
				</div>
			)}
			{flags.showOrgInCards && (
				<div className="text-xs text-white/50">
					{data?.primary_location?.source?.host_organization_name}
				</div>
			)}
			{flags.showJournalInCards && (
				<div className="text-xs text-white/50">
					{data?.primary_location?.source?.display_name}
				</div>
			)}
			{!flags.hideConceptsInCards && <Concepts data={data} />}
		</>
	);
}
