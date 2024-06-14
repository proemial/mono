import { toast } from "@proemial/shadcn-ui";

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

export function Notification({ children }: { children: React.ReactNode }) {
	return (
		<div className="max-w-80 w-full bg-background rounded-xl shadow-2xl m-auto">
			{children}
		</div>
	);
}
