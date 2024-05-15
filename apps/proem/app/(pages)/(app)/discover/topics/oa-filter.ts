// https://api.openalex.org/works?filter=domain:3
// https://api.openalex.org/works?filter=field:22
// https://api.openalex.org/works?filter=subfield:2214
// https://api.openalex.org/works?filter=topic:T12072

// https://api.openalex.org/works?filter=topics.id:T12072|T12859&select=topics

export const OaFilter = {
	toSelectedIdsArray: (filter?: string | null) => {
		if (!filter) return [];
		const params = filter?.split(",") ?? [];

		const domains: string[] = [];
		const fields: string[] = [];
		const subfield: string[] = [];
		const topics: string[] = [];

		// biome-ignore lint/complexity/noForEach: <explanation>
		params.forEach((param) => {
			const [type, value] = param.split(":") as [string, string];
			const values = value.split("|");

			switch (type) {
				case "topics.id":
					topics.push(...values.map((v) => `topic:${v}`));
					break;
				case "topics.domain.id":
					domains.push(...values.map((v) => `domain:${v}`));
					break;
				case "topics.field.id":
					fields.push(...values.map((v) => `field:${v}`));
					break;
				case "topics.subfield.id":
					subfield.push(...values.map((v) => `subfield:${v}`));
					break;
			}
		});

		return [...domains, ...fields, ...subfield, ...topics];
	},

	toQueryString: (values: string[]) => {
		const domains: string[] = [];
		const fields: string[] = [];
		const subfield: string[] = [];
		const topics: string[] = [];

		// biome-ignore lint/complexity/noForEach: <explanation>
		values.forEach((node) => {
			const [type, value] = node.split(":");
			switch (type) {
				case "domain":
					domains.push(value as string);
					break;
				case "field":
					fields.push(value as string);
					break;
				case "subfield":
					subfield.push(value as string);
					break;
				case "topic":
					topics.push(value as string);
					break;
			}
		});

		const params: string[] = [];
		if (topics.length > 0) {
			params.push(`topics.id:${topics.join("|")}`);
		}
		if (domains.length > 0) {
			params.push(`topics.domain.id:${domains.join("|")}`);
		}
		if (fields.length > 0) {
			params.push(`topics.field.id:${fields.join("|")}`);
		}
		if (subfield.length > 0) {
			params.push(`topics.subfield.id:${subfield.join("|")}`);
		}

		return params.join(",");
	},
};
