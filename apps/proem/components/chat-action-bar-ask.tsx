import { ShareDrawer, ShareDrawerProps } from "@/components/share-drawer";

type ChatActionBarAskProps = Pick<ShareDrawerProps, "shareId">;

export function ChatActionBarAsk({ shareId }: ChatActionBarAskProps) {
	return (
		<div className="flex justify-end">
			<ShareDrawer shareId={shareId} />
		</div>
	);
}
