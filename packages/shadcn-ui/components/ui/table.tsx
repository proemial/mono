import * as React from "react";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const tableRowVariants = cva(
	"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
	{
		variants: {
			variant: {
				profile:
					"border-0 transition-none hover:bg-transparent data-[state=selected]:bg-transparent",
			},
		},
		defaultVariants: {
			variant: "profile",
		},
	},
);

const tableCellVariants = cva(
	"p-0 py-2 align-middle [&:has([role=checkbox])]:pr-0",
	{
		variants: {
			variant: {
				icon: "w-4 px-1",
				key: "w-fit pl-4",
				value: "w-auto flex pl-0 justify-end",
				text: "w-min-0 flex pl-0",
			},
		},
		defaultVariants: {
			variant: "key",
		},
	},
);

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<div className="relative w-full overflow-auto">
		<table
			ref={ref}
			className={cn("w-full caption-bottom text-sm", className)}
			{...props}
		/>
	</div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn(
			"border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
			className,
		)}
		{...props}
	/>
));
TableFooter.displayName = "TableFooter";

export interface TableRowProps
	extends React.HTMLAttributes<HTMLTableRowElement>,
		VariantProps<typeof tableRowVariants> {
	asChild?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
	({ className, variant, ...props }, ref) => (
		<tr
			ref={ref}
			className={cn(tableRowVariants({ variant, className }))}
			{...props}
		/>
	),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			"h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
			className,
		)}
		{...props}
	/>
));
TableHead.displayName = "TableHead";

export interface TableCellProps
	extends React.TdHTMLAttributes<HTMLTableCellElement>,
		VariantProps<typeof tableCellVariants> {
	asChild?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
	({ className, variant, ...props }, ref) => (
		<td
			ref={ref}
			className={cn(tableCellVariants({ variant, className }), className)}
			{...props}
		/>
	),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption
		ref={ref}
		className={cn("mt-4 text-sm text-muted-foreground", className)}
		{...props}
	/>
));
TableCaption.displayName = "TableCaption";

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
