import { ShareDrawer, ShareDrawerProps } from "@/components/share-drawer";

type ChatActionBarAskProps = Pick<
	ShareDrawerProps,
	"shareId" | "trackingPrefix"
>;

export function ChatActionBarAsk({
	shareId,
	trackingPrefix,
}: ChatActionBarAskProps) {
	return (
		<div className="flex justify-end">
			<ShareDrawer shareId={shareId} trackingPrefix={trackingPrefix} />
		</div>
	);
}
