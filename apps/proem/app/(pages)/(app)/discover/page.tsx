import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { FeedFilter } from "./feed-filter";
import { OaFields } from "@proemial/models/open-alex-fields";

export default function DiscoverPage() {
	return (
		<div className="space-y-6">
			<Feed>
				<div className="-my-4">
					<HorisontalScrollArea>
						<FeedFilter
							items={[
								"all",
								...OaFields.map((field) => field.display_name.toLowerCase()),
							]}
							rootPath="/discover"
						/>
					</HorisontalScrollArea>
				</div>
			</Feed>
		</div>
	);
}
