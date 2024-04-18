type AnswerLayoutProps = {
	children: React.ReactNode;
	modal: React.ReactNode;
};

export default function AnswerLayout({ children, modal }: AnswerLayoutProps) {
	return (
		<>
			{children}
			{modal}
		</>
	);
}
