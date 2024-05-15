"use client";
import { Button, TreeSelect } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import oaTopics from "./oa.json";
import { TreeFilterHelpers as helpers } from "./tree-filter-helpers";
import { useState } from "react";

const FILTER_PARAM = "filter";

type Props = {
	rootPath: string;
};

export function TreeFilter({ rootPath }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const filter = searchParams.get(FILTER_PARAM);

	const [value, setValue] = useState<string[]>(
		helpers.toSelectedIdsArray(filter),
	);

	const handleClick = () => {
		const params = helpers.toQueryString(value);
		router.replace(`${rootPath}?${FILTER_PARAM}=${params}`);
	};

	return (
		<div className="flex gap-1">
			<TreeSelect
				showSearch
				style={{ width: "100%" }}
				dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
				placeholder="Please select"
				treeCheckable
				showCheckedStrategy="SHOW_PARENT"
				treeData={oaTopics}
				value={value}
				onChange={setValue}
				onSearch={(input) => {
					console.log(input);
				}}
			/>
			<Button onClick={handleClick}>Apply</Button>
		</div>
	);
}
