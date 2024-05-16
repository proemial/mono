"use client";
import { Button, Dropdown, MenuProps, Switch, TreeSelect } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import oaTopics from "./oa.json";
import { TreeFilterHelpers as helpers } from "./tree-filter-helpers";
import { useState } from "react";
import { Plus, Asterisk02 } from "@untitled-ui/icons-react";

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
	const [narrow, setNarrow] = useState(false);

	const handleClick = () => {
		const params = helpers.toQueryString(value, narrow);
		router.replace(`${rootPath}?${FILTER_PARAM}=${params}`);
	};

	const onMenuClick: MenuProps["onClick"] = (e) => {
		setNarrow(!narrow);
	};

	const or = {
		key: "or",
		label: "Include any",
		icon: <Asterisk02 />,
	};
	const and = {
		key: "and",
		label: "Include all",
		icon: <Plus />,
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
			<div>
				<Button onClick={handleClick}>Apply</Button>
			</div>
		</div>
	);
}
