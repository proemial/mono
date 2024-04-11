import { authMiddleware } from "@clerk/nextjs";
import { geolocation } from "@vercel/edge";
import { NextResponse } from "next/server";

export const runtime = "experimental-edge";

export default authMiddleware({
	publicRoutes: ["/(.*)"],
	afterAuth: (auth, request) => {
		const geo = geolocation(request);
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-country", geo?.country ?? "somewhere");
		requestHeaders.set("x-region", geo?.region ?? "somewhere");

		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	},
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
