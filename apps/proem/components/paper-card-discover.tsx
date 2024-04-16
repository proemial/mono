import { PaperCard, PaperCardProps } from "@/components/paper-card";
import { Globe } from "lucide-react";

type PaperCardDiscoverProps = Omit<PaperCardProps, "bullet">;

export function PaperCardDiscover(props: PaperCardDiscoverProps) {
	return <PaperCard {...props} bullet={<Globe className="size-4" />} />;
}
