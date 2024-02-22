export async function GET(
	_request: Request,
	{ params }: { params: { slug: string } },
) {
	if (params.slug === "error") {
		throw new Error("error from server route");
	}

	return new Response("ok");
}
