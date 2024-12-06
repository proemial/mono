import { Button } from "@proemial/shadcn-ui/components/ui/button";
import { Moon01, Sun } from "@untitled-ui/icons-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<div className="text-right">
			<Button
				variant="ghost"
				className={`h-8 w-full flex gap-2 p-2 border justify-start ${theme === "dark" ? "border-[#ffffff18]" : "border-[#00000018]"}`}
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			>
				{theme === "dark" ? (
					<>
					<Sun className="w-4 h-4 text-white/70" /><div>Switch to light mode</div>
					</>
				) : (
					<>
					<Moon01 className="w-3 h-3 text-black/70" /><div>Switch to dark mode</div>
					</>
				)}
			</Button>
		</div>
	);
}
