import { screenMaxWidth } from "@/app/constants";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	cn,
} from "@proemial/shadcn-ui";
import { XClose } from "@untitled-ui/icons-react";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
const ProfileContent = dynamic(
	() =>
		import("@/app/profile/profile-content").then((mod) => mod.ProfileContent),
	{ ssr: false },
);

type Props = {
	trigger: ReactNode;
	className?: string;
};

export function Profile({ trigger, className }: Props) {
	return (
		<Drawer>
			<DrawerTrigger className={cn(className)}>{trigger}</DrawerTrigger>
			<DrawerContent
				className={`${screenMaxWidth} h-dvh rounded-none mx-auto`}
				aria-describedby="Manage your account and settings"
			>
				<div className="flex flex-col h-full overflow-y-auto gap-6">
					<DrawerHeader className="pt-0">
						<DrawerTitle className="flex justify-end text-2xl font-normal">
							<DrawerClose>
								<Button
									asChild
									variant="ghost"
									className="p-0"
									onClick={trackHandler(analyticsKeys.ui.menu.click.close)}
								>
									<div>
										<XClose className="size-6" />
									</div>
								</Button>
							</DrawerClose>
						</DrawerTitle>
					</DrawerHeader>

					<ProfileContent />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
