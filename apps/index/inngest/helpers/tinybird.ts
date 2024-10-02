import { Time } from "@proemial/utils/time";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

const url = "https://api.eu-central-1.aws.tinybird.co/v0/events";
const token =
	"p.eyJ1IjogIjZmZjkyNzRjLTU0YjMtNGUyZi04N2JhLWMzZjgwZTBlMjE3NyIsICJpZCI6ICJhNjY0MTg4MC1kZjIyLTQ3OTMtODgxYy0zMTg1ZDc2YTcxY2YiLCAiaG9zdCI6ICJhd3MtZXUtY2VudHJhbC0xIn0.Zo0uLzj90Bykf6FwMd_ET8yNp1buPmcx7AYPbKv5b4Y";

export async function logEvent(
	name: string,
	payload: Record<string, string | number>,
) {
	const begin = Time.now();

	try {
		const response = await fetch(`${url}?name=${name}`, {
			method: "POST",
			body: JSON.stringify({
				timestamp: dayjs().toISOString(),
				transaction_id: uuid(),
				...payload,
			}),
			headers: { Authorization: `Bearer ${token}` },
		});
		console.log("response", response.status);

		const result = await response.text();
		console.log("result", result);
	} finally {
		Time.log(begin, `[logEvent][${name}] ${payload.name}`);
	}
}
