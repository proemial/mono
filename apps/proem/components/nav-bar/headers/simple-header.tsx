type Props = {
	title: string;
};

export const SimpleHeader = ({ title }: Props) => {
	return <div className="text-lg">{title}</div>;
};
