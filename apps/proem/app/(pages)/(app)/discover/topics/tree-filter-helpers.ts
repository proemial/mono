export const TreeFilterHelpers = {
	toSelectedIdsArray: (filter?: string | null) => {
		if (!filter) return [];

		const params = filter.split(",") ?? [];

		const domains: string[] = [];
		const fields: string[] = [];
		const subfield: string[] = [];
		const topics: string[] = [];

		// biome-ignore lint/complexity/noForEach: <explanation>
		params.forEach((param) => {
			const filter =
				param.startsWith("and:") || param.startsWith("or:")
					? param.substring(param.indexOf(":") + 1)
					: param;

			const [type, value] = filter.split(":") as [string, string];
			const values = value.includes("|")
				? value.split("|")
				: value.includes("+")
					? value.split("+")
					: value.split(" ");

			switch (type) {
				case "topic":
					topics.push(...values.map((v) => `topic:${v}`));
					break;
				case "domain":
					domains.push(...values.map((v) => `domain:${v}`));
					break;
				case "field":
					fields.push(...values.map((v) => `field:${v}`));
					break;
				case "subfield":
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
			params.push(`topic:${topics.join(separator)}`);
		}
		if (domains.length > 0) {
			params.push(`domain:${domains.join(separator)}`);
		}
		if (fields.length > 0) {
			params.push(`field:${fields.join(separator)}`);
		}
		if (subfield.length > 0) {
			params.push(`subfield:${subfield.join(separator)}`);
		}

		if (values.length < 2) {
			return params.join(",");
		}

		return `${narrow ? "and:" : "or:"}${params.join(",")}`;
	},

	toOaFilter: (filter: string) => {
		return decodeURI(filter)
			.replaceAll("topic", "topics.id")
			.replaceAll("domain", "topics.domain.id")
			.replaceAll("field", "topics.field.id")
			.replaceAll("subfield", "topics.subfield.id")
			.replaceAll("subtopics.field", "topics.subfield");
	},

	toOaFilters: (filter: string) => {
		const narrow = filter?.startsWith("and:");
		const query = TreeFilterHelpers.toOaFilter(
			filter?.startsWith("and:") || filter?.startsWith("or:")
				? filter.substring(filter.indexOf(":") + 1)
				: filter,
		);
		const filters = narrow ? [query] : query.split(",");

		return { filters, narrow };
	},
};
