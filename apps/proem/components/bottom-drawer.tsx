import { screenMaxWidth } from "@/app/constants";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	cn,
} from "@proemial/shadcn-ui";
import { XClose } from "@untitled-ui/icons-react";
import { ReactNode } from "react";

type Props = {
	open: boolean;
	trigger: ReactNode;
	children: ReactNode;
	onDrawerClose?: () => void;
};

export const BottomDrawer = ({
	open,
	trigger,
	children,
	onDrawerClose,
}: Props) => {
	return (
		<Drawer open={open} onClose={onDrawerClose}>
			<DrawerTrigger asChild>{trigger}</DrawerTrigger>
			<DrawerContent
				className={cn(screenMaxWidth, "w-full mx-auto rounded-none")}
			>
				<div className="flex flex-col h-full">
					<DrawerHeader className="pt-0 grow-0">
						<DrawerTitle className="flex flex-row-reverse items-center justify-between text-2xl font-normal">
							<DrawerClose onClick={onDrawerClose}>
								<XClose className="w-6 h-6" />
							</DrawerClose>
						</DrawerTitle>
					</DrawerHeader>
					<div className="h-full p-4 overflow-auto">{children}</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
