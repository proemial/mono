import { PageHeader } from "@/app/components/page-header";
import { ReactNode } from "react";

type Props = {
	title: string;
	children: ReactNode;
	action?: ReactNode;
};

export default function WithHeader({ title, children, action }: Props) {
	return (
		<>
			<PageHeader title={title} action={action} />
			<div className="w-full h-full max-w-screen-md mx-auto py-14">
				{children}
			</div>
		</>
	);
}
