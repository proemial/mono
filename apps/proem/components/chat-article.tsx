import { Header2, Header4, Header5, Paragraph } from "@proemial/shadcn-ui";
import { AlignLeft } from "lucide-react";

export function ChatArticle({ article }: { article: any }) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-4">
					<AlignLeft className="size-4" />
					<Header4>{article.type}</Header4>
				</div>
				<div>
					<Header5>{article.model}</Header5>
				</div>
			</div>
			{article.headline ? <Header2>{article.headline}</Header2> : null}
			<Paragraph>{article.text}</Paragraph>
		</div>
	);
}
