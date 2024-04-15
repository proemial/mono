import { TitleIcon } from "@/app/old/(pages)/(app)/oa/[id]/components/icons/title-icon";
import { IconWrapper } from "@/app/old/(pages)/(app)/oa/[id]/components/icons/wrapper";

export function Title({ children }: { children?: string }) {
	return (
		<>
			{children && (
				<div>
					<IconWrapper>
						<TitleIcon />
						Title
					</IconWrapper>
					<div className="text-white/50">{children}</div>
				</div>
			)}
		</>
	);
}
