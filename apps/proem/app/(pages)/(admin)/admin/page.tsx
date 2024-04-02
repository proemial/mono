import { AddStarterForm } from "@/app/(pages)/(admin)/admin/add-starter-form";
import { PageLayout } from "@/app/(pages)/(app)/page-layout";
import { answers } from "@/app/api/bot/answer-engine/answers";
import {
	INTERNAL_COOKIE_NAME,
	isInternalUser,
} from "@/app/components/analytics/is-internal-user";
import { Button } from "@/app/components/shadcn-ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/app/components/shadcn-ui/table";
import { cookies } from "next/headers";
import { z } from "zod";

export default async function AdminPage() {
	const cookie = cookies().get(INTERNAL_COOKIE_NAME)?.value ?? "";
	const { email } = z.object({ email: z.string() }).parse(JSON.parse(cookie));
	const { isInternal } = isInternalUser(email);

	if (!isInternal) {
		throw new Error("Unauthorized");
	}

	const starterQuestions = await answers.getStarters();

	return (
		<PageLayout title="admin">
			<div className="w-full py-3 space-y-4">
				<h1>Starter questions ({starterQuestions.length}):</h1>
				<div className="flex gap-2">
					<AddStarterForm />
				</div>

				<Table className="">
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Question</TableHead>
							<TableHead>Answer</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="">
						{starterQuestions.map((question) => {
							return (
								<TableRow className="">
									<TableCell className="font-medium">{question.id}</TableCell>
									<TableCell className="">
										Q: {question.question}
										<br />
										A: {question.answer}:
									</TableCell>
									<TableCell className="text-right">
										<Button>Delete</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</PageLayout>
	);
}
