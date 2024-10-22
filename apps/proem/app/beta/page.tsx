import Link from "next/link";

const experiments = [
	{ name: "spaces", path: "/space" },
	{ name: "index", path: "https://index.proem.ai" },
	{ name: "reels", path: "/reels" },
	{ name: "news", path: "/news" },
	// ...
];
const links = [...experiments, ...experiments];

export default function BetaPage() {
	return (
		<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-4 h-screen">
			{links
				.sort(() => Math.random() - 0.5)
				.map((item, index) => {
					return (
						<Link
							href={item.path}
							key={index}
							className={`p-4 rounded-lg flex items-center justify-center text-white text-4xl font-bold ${color()} ${size()}`}
						>
							{item.name}
						</Link>
					);
				})}
		</div>
	);
}

const color = () => {
	const colors = [
		"bg-sky-400",
		"bg-rose-500",
		"bg-emerald-400",
		"bg-amber-400",
		"bg-fuchsia-500",
		"bg-indigo-400",
		"bg-cyan-400",
		"bg-orange-500",
		"bg-lime-400",
		"bg-pink-500",
		"bg-violet-500",
		"bg-teal-400",
	];

	return colors[Math.floor(Math.random() * colors.length)];
};

const size = () => {
	const sizes = [
		"",
		"col-span-2",
		"row-span-2",
		"col-span-2 row-span-2",
		"col-span-3",
	];

	return sizes[Math.floor(Math.random() * sizes.length)];
};
