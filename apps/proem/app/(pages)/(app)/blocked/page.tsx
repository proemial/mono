export default function BlockedPage() {
	return (
		<div className="flex flex-col flex-grow justify-center -mt-[60px]">
			<h1>Request blocked</h1>
			<p>
				We're receiving too much traffic from your location. Please try again in
				a few minutes.
			</p>
		</div>
	);
}
