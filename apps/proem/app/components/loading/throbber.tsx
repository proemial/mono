export function Throbber({ text }: { text: string }) {
	return (
		<div className="flex items-center gap-[2px] justify-begin">
			<PulsingCircle />
			<PulsingCircle className="animation-delay-300" />
			<PulsingCircle className="animation-delay-600" />
			<div className="ml-2 text-sm text-white text-opacity-50 truncate">
				{text}
			</div>
		</div>
	);
}

export function SinglarThrobber({ delay = 0 }: { delay?: number }) {
	return <PulsingCircle className="inline-block ml-1" />;
}

function PulsingCircle({ className = "" }: { className?: string }) {
	return (
		<div
			className={`w-3 h-3 bg-[#7DFA86] rounded-full animate-throbber ${className}`}
		/>
	);
}
