"use client";
import { Button, TreeSelect } from "antd";
import "react-dropdown-tree-select/dist/styles.css";
import { useRouter, useSearchParams } from "next/navigation";
import oaTopics from "./oa.json";
import { OaFilter } from "./oa-filter";
import { useState } from "react";

const FILTER_PARAM = "filter";

type Props = {
	rootPath: string;
};

export function FeedFilterTree({ rootPath }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const filter = searchParams.get(FILTER_PARAM);

	const [value, setValue] = useState<string[]>(
		OaFilter.toSelectedIdsArray(filter),
	);

	const handleClick = () => {
		const params = OaFilter.toQueryString(value);
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
