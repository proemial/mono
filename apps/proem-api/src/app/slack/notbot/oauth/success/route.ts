import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
	return new NextResponse(
		`<!DOCTYPE html>
        <html>
            <head>
                <title>Installation Successful</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f8f9fa;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 { color: #2c3e50; }
                    p { color: #34495e; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎉 Installation Successful!</h1>
                    <p>You can now close this window and start using the app in your Slack workspace.</p>
                </div>
            </body>
        </html>`,
		{
			headers: {
				"Content-Type": "text/html",
			},
		},
	);
}
