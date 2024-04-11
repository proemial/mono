export function ChatActionBar({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center place-content-between text-2xs">
				{children}
			</div>
		</div>
	);
}

export function ChatActionBarColumn({
	children,
}: { children: React.ReactNode }) {
	return <div className="flex items-center gap-10">{children}</div>;
}
