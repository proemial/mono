"use client";
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
import { useRouter } from "next/navigation";

type FullPageDrawerProps = {
	title?: string;
	children?: React.ReactNode;
	render?: (DrawerCloseComponent: typeof DrawerClose) => React.ReactNode;
	trigger?: React.ReactNode;
	onClose?: () => void;
};

export function FullSizeDrawer({
	children,
	title,
	trigger,
	onClose,
	render,
}: FullPageDrawerProps) {
	return (
		<Drawer {...(onClose ? { open: true } : {})} onClose={onClose}>
			{trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
			<DrawerContent
				className={cn(screenMaxWidth, "w-full h-full mx-auto rounded-none")}
			>
				<div className="flex flex-col h-full">
					<DrawerHeader className="pt-0 grow-0">
						<DrawerTitle className="flex justify-between flex-row-reverse text-2xl font-normal items-center">
							<DrawerClose onClick={onClose}>
								<XClose className="w-6 h-6" />
							</DrawerClose>

							<div>{title}</div>
						</DrawerTitle>
					</DrawerHeader>
					<div className="p-4 pb-0">
						{render ? render(DrawerClose) : children}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
type FullPageDrawerWithRouterNavigationProps = Pick<
	FullPageDrawerProps,
	"title"
> & {
	children: React.ReactNode;
};

/**
 * PageDrawer is a full-size drawer that can be used to embed new routes in a drawer.
 */
export function PageDrawer({
	children,
	title,
}: FullPageDrawerWithRouterNavigationProps) {
	const router = useRouter();
	const closeHandle = () => router.back();

	return (
		<FullSizeDrawer title={title} onClose={closeHandle}>
			{children}
		</FullSizeDrawer>
	);
}
