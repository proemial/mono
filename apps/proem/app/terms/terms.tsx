import { Header4, Paragraph } from "@proemial/shadcn-ui";

export default function Terms({ className = "" }: { className?: string }) {
	return (
		<div className={`space-y-5 ${className}`}>
			<div className="text-2xl leading-normal">Terms of service</div>

			<div className="space-y-3">
				<Header4>Introduction</Header4>
				<Paragraph>
					Welcome to Proem! By using our services, you agree to these Terms of
					Service (ToS).
				</Paragraph>
			</div>

			<div className="space-y-3">
				<Header4>Accessing Our Services</Header4>
				<Paragraph>
					While unregistered users can browse freely without any data logging,
					registered users can contribute by commenting on preprints.
					Registering requires providing a valid email address and creating a
					password.
				</Paragraph>
			</div>

			<div className="space-y-3">
				<Header4>Use of Services</Header4>
				<Paragraph>
					As a user, you agree to use our services respectfully and responsibly,
					refraining from any behavior that infringes upon the rights of others
					or violates applicable laws.
				</Paragraph>
			</div>

			<div className="space-y-3">
				<Header4>Data</Header4>
				<Paragraph>
					Registered users&apos; activities, comments, and posted content will
					be logged and stored publically, becoming part of the Commons.
					However, we will not share sensitive information without your consent.
				</Paragraph>
			</div>

			<div className="space-y-3">
				<Header4>Intellectual Property</Header4>
				<Paragraph>
					Content on Proem is published under Creative Commons licenses. You
					agree to respect these licenses when using or distributing the
					content.
				</Paragraph>
			</div>

			<div className="space-y-3">
				<Header4>Changes to Terms of Service</Header4>
				<Paragraph>
					We reserve the right to modify these ToS. Any changes will be posted
					on this page.
				</Paragraph>
			</div>

			<div className="space-y-3">
				<Header4>Contact Us</Header4>
				<Paragraph>
					If you have any questions about these terms, please contact us at{" "}
					<a href="mailto:hi@proem.ai">hi@proem.ai</a>.
				</Paragraph>
				<Paragraph>
					Thank you for contributing to the Commons through Proem!
				</Paragraph>
				<p className="mt-4 italic text-right">Last updated: 17th July, 2023.</p>
			</div>
		</div>
	);
}
