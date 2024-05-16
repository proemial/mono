export const TreeFilterHelpers = {
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
			const values = value.includes("|") ? value.split("|") : value.split(" ");

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

	toQueryString: (values: string[], narrow?: boolean) => {
		const domains: string[] = [];
		const fields: string[] = [];
		const subfield: string[] = [];
		const topics: string[] = [];

		const separator = narrow ? "+" : "|";

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
			params.push(`topics.id:${topics.join(separator)}`);
		}
		if (domains.length > 0) {
			params.push(`topics.domain.id:${domains.join(separator)}`);
		}
		if (fields.length > 0) {
			params.push(`topics.field.id:${fields.join(separator)}`);
		}
		if (subfield.length > 0) {
			params.push(`topics.subfield.id:${subfield.join(separator)}`);
		}

		return params.join(",");
	},
};
