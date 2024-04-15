import { AddStarterForm } from "@/app/(pages)/(admin)/admin/add-starter-form";
import { DeleteStarterButton } from "@/app/(pages)/(admin)/admin/delete-starter-button";
import { PageLayout } from "@/app/(pages)/(app)/page-layout";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { INTERNAL_COOKIE_NAME, getInternalUser } from "../../(app)/profile/user";

export default async function AdminPage() {
	const cookie = cookies().get(INTERNAL_COOKIE_NAME)?.value;

	if (!cookie) {
		redirect("/");
	}

	const { email } = z.object({ email: z.string() }).parse(JSON.parse(cookie));
	const { isInternal } = getInternalUser(email);

	if (!isInternal) {
		redirect("/");
	}

	const starterQuestions = await answers.getStarters();

	return (
		<PageLayout title="admin">
			<div className="w-full py-3 space-y-4">
				<h1>Starter questions ({starterQuestions.length}):</h1>
				<AddStarterForm />

				<div className="flow-root w-full mt-8">
					<table className="divide-y divide-gray-700">
						<thead>
							<tr>
								<th
									scope="col"
									className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
								>
									Question
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-white"
								>
									ID
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-800">
							{starterQuestions.map((question) => (
								<tr key={question.id}>
									<td className="py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
										<div className="font-bold text-white">
											{question.question}
										</div>
										<div className="mt-1 font-normal text-gray-400">
											{question.answer}
										</div>
									</td>
									<td className="pr-0">
										<div className="mb-1 text-sm font-normal text-center text-gray-400 whitespace-nowrap">{`{ id: ${question.id}}`}</div>

										<DeleteStarterButton id={question.id} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</PageLayout>
	);
}
