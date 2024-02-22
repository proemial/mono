import { ClientErrorComponent } from "@/app/(pages)/error-test/client/client-error";

type Props = {
	searchParams: { error: string };
};
export default async function ErrorTestClientComponent({
	searchParams,
}: Props) {
	return <ClientErrorComponent throwError={Boolean(searchParams.error)} />;
}
