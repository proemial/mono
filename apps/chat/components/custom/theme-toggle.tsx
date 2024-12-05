import { Button } from "@proemial/shadcn-ui/components/ui/button";
import { Moon01, Sun } from "@untitled-ui/icons-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<div className="text-right">
			<Button
				variant="ghost"
				className={`h-8 w-12 p-2 border ${theme === "dark" ? "border-white/50" : "border-black/50"}`}
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			>
				{theme === "dark" ? (
					<Sun className="w-6 h-6 text-white/70" />
				) : (
					<Moon01 className="w-4 h-4 text-black/70" />
				)}
			</Button>
		</div>
	);
}
