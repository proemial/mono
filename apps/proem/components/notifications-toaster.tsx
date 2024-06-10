import { Toaster } from "@proemial/shadcn-ui";

export function NotificationsToaster() {
	return <Toaster position="top-center" className="mt-11" visibleToasts={1} />;
}
