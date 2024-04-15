import { PubdateIcon } from "@/app/old/(pages)/(app)/oa/[id]/components/icons/pubdate-icon";
import { IconWrapper } from "@/app/old/(pages)/(app)/oa/[id]/components/icons/wrapper";
import { OpenAlexPaper } from "@proemial/models/open-alex";

export function Publication({ paper }: { paper: OpenAlexPaper }) {
	const hasData =
		paper?.data?.publication_date ||
		paper?.data?.primary_location?.source?.host_organization_name ||
		paper?.data?.primary_location?.source?.display_name;

	return (
		<>
			{hasData && (
				<div>
					<IconWrapper>
						<PubdateIcon />
						Published
					</IconWrapper>
					<div className="flex flex-col text-white/50">
						{paper.data.publication_date && (
							<div className="flex">
								<div className="w-6">On:</div>
								<div className="flex-1">{paper.data.publication_date}</div>
							</div>
						)}
						{paper.data.primary_location?.source?.host_organization_name && (
							<div className="flex">
								<div className="w-6">By:</div>
								<div className="flex-1">
									{paper.data.primary_location?.source?.host_organization_name}
								</div>
							</div>
						)}
						{paper.data.primary_location?.source?.display_name && (
							<div className="flex">
								<div className="w-6">In:</div>
								<div className="flex-1">
									{paper.data.primary_location?.source?.display_name}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
