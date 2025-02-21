export const EphemeralMessage = {
	removeOriginal: async (response_url: string, token: string) => {
		await fetch(response_url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ delete_original: true }),
		});
	},
};
