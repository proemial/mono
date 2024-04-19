"use client";
import { screenMaxWidth } from "@/app/constants";
import {
	Button,
	Drawer,
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
	children: React.ReactNode;
	trigger?: React.ReactNode;
	onClose?: () => void;
};

export function FullPageDrawer({
	children,
	title,
	trigger,
	onClose,
}: FullPageDrawerProps) {
	const router = useRouter();
	const closeHandle = () => router.back();

	return (
		<Drawer open onClose={onClose}>
			{trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
			<DrawerContent
				className={cn(screenMaxWidth, "w-full h-full mx-auto rounded-none")}
			>
				<div className="flex flex-col max-h-full gap-6">
					<DrawerHeader className="pt-0 grow-0">
						<DrawerTitle className="flex justify-between flex-row-reverse text-2xl font-normal items-center">
							<Button variant="ghost" className="p-0" onClick={closeHandle}>
								<XClose className="w-6 h-6" />
							</Button>

							<div>{title}</div>
						</DrawerTitle>
					</DrawerHeader>
					<div className="grow px-8 overflow-auto">{children}</div>
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

export function FullPageDrawerWithRouterNavigation({
	children,
	title,
}: FullPageDrawerWithRouterNavigationProps) {
	const router = useRouter();
	const closeHandle = () => router.back();

	return (
		<FullPageDrawer title={title} onClose={closeHandle}>
			{children}
		</FullPageDrawer>
	);
}
