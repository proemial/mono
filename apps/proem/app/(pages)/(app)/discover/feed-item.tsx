type FeedItemProps = {
	date: string;
	title: string;
	tags: string[];
};
export default function FeedItem({ date, title, tags }: FeedItemProps) {
	return (
		<div>
			<h3>{date}</h3>
			<h3>{title}</h3>
			<h3>{tags}</h3>
		</div>
	);
}
