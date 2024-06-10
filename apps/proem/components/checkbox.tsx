import { Label, Checkbox as ShadcnUICheckbox, cn } from "@proemial/shadcn-ui";

type CheckProps = Parameters<typeof ShadcnUICheckbox>[0];

function Check({ className, ...rest }: CheckProps) {
	return (
		<ShadcnUICheckbox
			className={cn(
				"data-[state=checked]:bg-green-600/20 data-[state=checked]:text-green-600 data-[state=checked]:border-green-600/20",
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
