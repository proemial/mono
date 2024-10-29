import Link from "next/link";

const experiments = [
	{ name: "index", path: "https://index.proem.ai" },
	{ name: "reels", path: "https://reels.proem.ai" },
	{ name: "news", path: "https://news.proem.ai" },
	{ name: "ask", path: "https://ask.proem.ai" },
	{ name: "organisations", path: "https://proem.ai/discover/ibm" },
	{
		name: "spaces",
		path: "https://proem.ai/space/col_ictqflngkeeyvpkauaqns6hz",
	},
	{
		name: "rss",
		path: "https://index.proem.ai/rss?like=Graph%20mining%20uses%20features%20to%20analyze%20how%20a%20set%20of%20observations%20are%20related%20based%20on%20user-facing%20similarity%20signals1.%20It%20involves%20processing,%20analyzing,%20and%20extracting%20valuable%20insights%20from%20large%20amounts%20of%20graph%20data,%20where%20nodes%20represent%20entities%20and%20edges%20represent%20relationships%20between%20those%20entities",
	},
	{
		name: "embed",
		path: "https://proem.ai/embed/col_kkm3c75heomrob12f3ues4f0?foreground=FD4145&background=F8F8F8",
	},
	// ...
];
const links = [...experiments];

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
