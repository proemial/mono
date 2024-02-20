import { PubdateIcon } from "@/app/(pages)/(app)/oa/[id]/components/icons/pubdate-icon";
import { IconWrapper } from "@/app/(pages)/(app)/oa/[id]/components/icons/wrapper";
import dayjs from "dayjs";

export function PublicationDate({ children }: { children?: string }) {
	return (
		<>
			{children && (
				<div>
					<IconWrapper>
						<PubdateIcon />
						Publication date
					</IconWrapper>
					<div className="text-white/50">
						{dayjs(children).format("D MMM YYYY")}
					</div>
				</div>
			)}
		</>
	);
}
