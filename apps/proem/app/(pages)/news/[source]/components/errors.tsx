export function ScraperError() {
	return (
		<div className="bg-black/80 flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm">
			<div className="p-8 mx-4 w-full max-w-lg bg-white rounded-lg shadow-lg">
				<div className="flex flex-col space-y-4">
					<div className="space-y-2">
						<h2 className="text-xl font-bold tracking-tight">
							We can't access this article 🔎
						</h2>
						<p className="text-muted-foreground">
							We had trouble reading the article you want annotated. This could
							be because it's not an article, there's a paywall, or the website
							is not very welcoming to our robots.
						</p>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							className="disabled:opacity-80 flex items-center px-4 h-9 text-sm font-medium rounded-md"
							onClick={(e) => {
								(e.target as HTMLButtonElement).disabled = true;
								window.location.href = "/news";
							}}
						>
							Dismiss
						</button>
						<button
							type="button"
							className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-80 flex items-center px-4 h-9 text-sm font-medium rounded-md"
							onClick={(e) => {
								(e.target as HTMLButtonElement).disabled = true;
								window.location.reload();
							}}
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function AnnotationError({ error }: { error: Error }) {
	console.error("error", error);

	return (
		<div className="bg-black/80 flex fixed inset-0 z-50 justify-center items-center font-mono backdrop-blur-sm">
			<div className="bg-black/90 border-green-500/30 p-8 mx-4 w-full max-w-lg rounded-lg border shadow-lg">
				<div className="flex justify-between mb-6">
					<div className="overflow-hidden text-sm text-green-500" />
					<button
						type="button"
						onClick={() => {
							window.location.href = "/news";
						}}
						className="hover:text-green-400 text-green-500 cursor-pointer"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				<div className="mb-6 space-y-3 text-center">
					<div className="text-xl font-bold tracking-wider text-green-500 animate-pulse">
						SYSTEM OVERLOAD
					</div>
					<div className="text-green-400/80">
						Connection throttled due to high traffic volume
					</div>
					<div className="text-green-400/60 text-sm">
						reboot sequence initiated...
					</div>
				</div>

				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="hover:bg-green-500/10 flex gap-2 items-center px-4 py-2 text-green-500 bg-black rounded border border-green-500 transition-colors animate-pulse"
					>
						<svg
							className="w-4 h-4 animate-spin"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						FORCE REBOOT
					</button>
				</div>
			</div>
		</div>
	);
}
