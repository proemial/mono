"use client";
export function ClientErrorComponent() {
	throw new Error("error from client component");

	return <h1>error</h1>;
}
