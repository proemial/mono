"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Button, ButtonProps } from "@proemial/shadcn-ui";
import { Menu05 } from "@untitled-ui/icons-react";

type MenuProps = Pick<ButtonProps, "asChild">;

export function MenuButton({ asChild }: MenuProps) {
	return (
		<Button
			asChild={asChild}
			variant="ghost"
			size="icon"
			onClick={trackHandler(analyticsKeys.ui.menu.click.open)}
			className="-ml-3 cursor-pointer"
		>
			<div>
				<Menu05 className="size-5" />
			</div>
		</Button>
	);
}
