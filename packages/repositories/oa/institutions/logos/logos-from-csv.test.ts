import { it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { parse } from "csv-parse/sync";

// Download CSV's from:
// https://docs.google.com/spreadsheets/d/10olMaxZjloMMxbIIz8uaI87J9W4tL3gHAGK6vpKI_wo/edit?gid=821123776#gid=821123776

const csvFiles = [
	{
		name: "Fortune 500 - Nasdac500.csv",
		columnIndices: { identifier: 6, url: 7, whiteOnBlack: 8 },
	},
	{
		name: "Fortune 500 - fortune500.csv",
		columnIndices: { identifier: 0, url: 5, whiteOnBlack: 6 },
	},
];

const directory = "oa/institutions/logos";

it("Generate `logos.json` from `csvFiles`", () => {
	let logos: {
		[identifier: string]: { url: string; whiteOnBlack?: boolean };
	} = {};

	for (const file of csvFiles) {
		const { name, columnIndices: column } = file;

		const fileContent = fs.readFileSync(path.resolve(directory, name), {
			encoding: "utf-8",
		});
		console.log(name, "file size:", fileContent.length);

		const result: string[] = parse(fileContent, {
			bom: true,
			columns: false,
			on_record: (record, { lines }) =>
				lines === 1 // Remove first line (header)
					? null
					: !record[column.url] // Remove entries with empty URL
						? null
						: [
								// Pick columns
								lines,
								record[column.identifier].toLowerCase(),
								record[column.url],
								record[column.whiteOnBlack],
							],
		});
		console.log(name, "entries:", result.length);

		logos = {
			...logos,
			...Object.fromEntries(
				result.map((item) => [
					item[1],
					{ url: item[2], whiteOnBlack: item[3] },
				]),
			),
		};
	}

	console.log("Number of logos:", Object.keys(logos).length);
	fs.writeFileSync(
		path.resolve(directory, "logos.json"),
		JSON.stringify(logos, null, 2),
	);
});
