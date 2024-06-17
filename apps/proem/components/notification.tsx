import { toast } from "@proemial/shadcn-ui";
import { useEffect } from "react";

type CustomToast = Parameters<typeof toast.custom>[0];

export function openUnstyledNotifcation(customToast: CustomToast) {
	// Dismiss all existing toasts
	toast.dismiss();

	toast.custom(customToast, {
		style: { height: "unset", width: "100%", boxShadow: "none" },
		unstyled: true,
		cancel: true,
		// disabling automatically closing the toast to handle it programmatically instead
		duration: Number.POSITIVE_INFINITY,
	});
}

type NotificationProps = {
	children: React.ReactNode;
	closeOnBlur?: boolean;
};

export function Notification({
	children,
	closeOnBlur: closeOnUnFocus,
}: NotificationProps) {
	useEffect(() => {
		if (closeOnUnFocus) {
			const listener = (event: MouseEvent) => {
				if (!(event.target as HTMLElement).closest(".toast")) {
					toast.dismiss();
				}
			};

			document.addEventListener("click", listener);
			return () => document.removeEventListener("click", listener);
		}
	}, [closeOnUnFocus]);

	return (
		<div className="max-w-80 w-full bg-background rounded-xl shadow-2xl m-auto">
			{children}
		</div>
	);
}
