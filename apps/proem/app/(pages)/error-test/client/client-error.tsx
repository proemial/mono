"use client";
export function ClientErrorComponent({ throwError }: { throwError: boolean }) {
	if (throwError) {
		throw new Error("error from client component");
	}

	return <h1>error</h1>;
}
