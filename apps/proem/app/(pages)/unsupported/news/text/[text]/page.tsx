import { Header } from "@/app/(pages)/news/components/header";

export default function Page({ params }: { params: { text: string } }) {
	return (
		<>
			<div className="flex flex-col items-start relative self-stretch w-full">
				<Header />

				<div className="p-2 mt-8 text-white">
					<code>We unfortunately do not support text yet.</code>
					<div className="mt-3 font-mono text-green-400 animate-pulse">
						<code className="tracking-wider">
							{Array.from(decodeURIComponent(params.text)).map((char, i) => (
								<span
									key={i}
									className="inline-block animate-fall"
									style={{
										animationDelay: `${Math.random() * 2}s`,
										textShadow: "0 0 8px currentColor",
									}}
								>
									{char}
								</span>
							))}
						</code>
					</div>
				</div>
			</div>
		</>
	);
}
