export const config = {
	matcher: "/survey",
};

export default function middleware(request: Request) {
	const url = new URL(request.url);
	if (url.pathname === "/survey") {
		return Response.redirect(new URL("https://tally.so/r/mB7Q7e"));
	}
}
