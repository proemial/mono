import { cn, Icons } from "@proemial/shadcn-ui";
import { numberFrom } from "@proemial/utils/string";

export function Avatar({ seed }: { seed: string }) {
	return (
		<div
			className={`p-1 rounded-full ${AVATAR_COLORS[numberFrom(seed, AVATAR_COLORS.length)]}`}
		>
			<Icons.anonymous className="size-3" />
		</div>
	);
}

const AVATAR_COLORS = [
	"bg-[hsl(10,30%,72%)]",
	"bg-[hsl(20,30%,72%)]",
	"bg-[hsl(30,30%,72%)]",
	"bg-[hsl(40,30%,72%)]",
	"bg-[hsl(50,30%,72%)]",
	"bg-[hsl(60,30%,72%)]",
	"bg-[hsl(70,30%,72%)]",
	"bg-[hsl(80,30%,72%)]",
	"bg-[hsl(90,30%,72%)]",
	"bg-[hsl(100,30%,72%)]",
	"bg-[hsl(110,30%,72%)]",
	"bg-[hsl(120,30%,72%)]",
	"bg-[hsl(130,30%,72%)]",
	"bg-[hsl(140,30%,72%)]",
	"bg-[hsl(150,30%,72%)]",
	"bg-[hsl(160,30%,72%)]",
	"bg-[hsl(170,30%,72%)]",
	"bg-[hsl(180,30%,72%)]",
	"bg-[hsl(190,30%,72%)]",
	"bg-[hsl(200,30%,72%)]",
	"bg-[hsl(210,30%,72%)]",
	"bg-[hsl(220,30%,72%)]",
	"bg-[hsl(230,30%,72%)]",
	"bg-[hsl(240,30%,72%)]",
	"bg-[hsl(250,30%,72%)]",
	"bg-[hsl(260,30%,72%)]",
	"bg-[hsl(270,30%,72%)]",
	"bg-[hsl(280,30%,72%)]",
	"bg-[hsl(290,30%,72%)]",
	"bg-[hsl(300,30%,72%)]",
	"bg-[hsl(310,30%,72%)]",
	"bg-[hsl(320,30%,72%)]",
	"bg-[hsl(330,30%,72%)]",
	"bg-[hsl(340,30%,72%)]",
	"bg-[hsl(350,30%,72%)]",
	"bg-[hsl(360,30%,72%)]",
];
