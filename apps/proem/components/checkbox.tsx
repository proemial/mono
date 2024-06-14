import { Label, Checkbox as ShadcnUICheckbox, cn } from "@proemial/shadcn-ui";

type CheckProps = Parameters<typeof ShadcnUICheckbox>[0];

export function Check({ className, ...rest }: CheckProps) {
	return (
		<ShadcnUICheckbox
			className={cn(
				"data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground data-[state=checked]:border-secondary",
				className,
			)}
			{...rest}
		/>
	);
}

type CheckboxProps = CheckProps & {
	children?: React.ReactNode;
};

export function Checkbox({ children, id, ...rest }: CheckboxProps) {
	if (children) {
		return (
			<div className="flex items-center space-x-4">
				<Check id={id} {...rest} />
				<Label htmlFor={id} className="text-base">
					{children}
				</Label>
			</div>
		);
	}
	return <Check {...rest} />;
}
