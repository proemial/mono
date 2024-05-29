"use client";
import { Dropdown, MenuProps, Switch, TreeSelect } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import oaTopics from "./oa.json";
import { TreeFilterHelpers as helpers } from "../topics/tree-filter-helpers";
import { useState } from "react";
import { Check } from "@untitled-ui/icons-react";

const FILTER_PARAM = "filter";

type Props = {
	rootPath: string;
};

export function Filter({ rootPath }: Props) {
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
		icon: !narrow ? <Check /> : <div className="w-6" />,
		label: "Must include any",
	};
	const and = {
		key: "and",
		icon: narrow ? <Check /> : <div className="w-6" />,
		label: "Must include all",
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
				<Dropdown.Button
					menu={{ items: [or, and], onClick: onMenuClick }}
					onClick={handleClick}
				>
					Apply
				</Dropdown.Button>
			</div>
		</div>
	);
}
