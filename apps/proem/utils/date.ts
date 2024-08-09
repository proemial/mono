import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);

// export function formatDate(format: "relative" | "absolute" = "absolute") {

export function formatDate(
	dateString?: string,
	format: "relative" | "absolute" = "absolute",
) {
	const date = dateString ? dayjs(dateString) : dayjs();

	if (format === "absolute") {
		return date.format("YYYY-MM-DD");
	}

	// @ts-ignore
	return date.isToday() ? "today" : date.fromNow();
}
