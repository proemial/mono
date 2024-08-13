import { getRandomTheme } from "@/app/theme/color-theme";
import { useUser } from "@clerk/nextjs";
import { ForwardedRef, forwardRef } from "react";

type Props = {
	spaceName: string;
	spaceId?: string;
	paperTitle?: string;
};

export const Header = forwardRef(
	(
		{ spaceName, spaceId, paperTitle }: Props,
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		const theme = getRandomTheme(spaceId ?? "");
		const paperTitleNoQuotes = paperTitle?.replace(/"/g, "");
		const { isLoaded, isSignedIn, user } = useUser();
		const isDefaultSpace = spaceId === user?.id;

		return (
			<div className="flex gap-2 items-center px-3 py-2" ref={ref}>
				<div
					className="w-[50px] h-[50px] rounded-md shrink-0"
					style={
						isLoaded && isSignedIn && user && isDefaultSpace
							? {
									backgroundImage: `url(${user.imageUrl})`,
									backgroundSize: "100%",
								}
							: {
									backgroundImage: `url(/backgrounds/patterns_${theme.image}.png)`,
									backgroundSize: "400%",
									backgroundPosition: "center",
								}
					}
				/>
				<div className="flex flex-col justify-between truncate text-white">
					{paperTitle ? (
						<>
							<div className="truncate">{paperTitleNoQuotes}</div>
							<div className="truncate opacity-50">{spaceName}</div>
						</>
					) : (
						<div className="truncate">{spaceName}</div>
					)}
				</div>
			</div>
		);
	},
);
