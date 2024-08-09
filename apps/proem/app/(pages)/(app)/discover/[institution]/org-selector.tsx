"use client";
import { Button } from "@proemial/shadcn-ui";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@proemial/shadcn-ui/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function OrgSelector({
	institutions,
	selected,
}: {
	institutions: { id: string; display_name: string }[];
	selected: string;
}) {
	const router = useRouter();

	if (institutions.length === 1) {
		return (
			<div className="text-[10px]">
				Papers authored by individuals affiliated with <i>{selected}</i>.
			</div>
		);
	}
	return (
		<>
			<div className="text-[10px]">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="mx-[-16px] text-wrap whitespace-nowrap inline"
						>
							Papers authored by individuals affiliated with <i>{selected}</i>.
							{institutions?.length > 1 && (
								<>
									{" "}
									See other related institutions, organizations, and companies{" "}
									<span className="underline">here</span>.
								</>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						{institutions.slice(1).map((institution, i) => (
							<DropdownMenuItem
								key={i}
								onClick={() =>
									router.replace(`/discover/${institution.display_name}`)
								}
							>
								{institution.display_name}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
}

// <div className="text-xs">
// Did you mean:
// {institutions.slice(1).map((institution) => (
// 	<Link
// 		key={institution.id}
// 		href={`/discover/${institution.display_name}`}
// 		className="text-blue-500 underline ml-1"
// 	>
// 		{`${institution.display_name}`}
// 		{/*
// 									{`${institution.display_name} (${
// 										institution.counts_by_year
// 											.filter((o) => o.year === 2024)
// 											.at(0)?.works_count
// 									} / ${institution.works_count})`}
// 								 */}
// 	</Link>
// ))}
// </div>
