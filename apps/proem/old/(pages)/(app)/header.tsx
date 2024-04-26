import { PageHeader } from "@/app/components/page-header";
import { screenMaxWidth } from "@/app/constants";
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
			<div className={`${screenMaxWidth} w-full h-full mx-auto py-14`}>
				{children}
			</div>
		</>
	);
}
