import { NextResponse } from "next/server";

export default function WelcomePage() {
	return (
		<div>
			<h1>Installation Successful!</h1>
			<p>
				You can now close this window and start using the app in your Slack
				workspace.
			</p>
		</div>
	);
}
