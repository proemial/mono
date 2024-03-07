import { ReactNode } from "react";
import { ProemPage } from "./page-layout";
import { ChildComponent1, ChildComponent2 } from "./children";

export default function Page1() {
	return (
		<ProemPage title="refactored" action={<div>action</div>}>
			<ChildComponent1 />
			<ChildComponent2 />
		</ProemPage>
	);
}
