import { answers } from "@/app/api/bot/answer-engine/answers";
import { MOCKED_ANSWER_ENGINE_RUN } from "@/app/api/bot/answer-engine/mocked-answer-engine-run";
import { saveAnswer } from "@/app/api/bot/answer-engine/save-answer";
import { NewAnswer } from "@proemial/data/neon/schema/answersTable";
import { experimental_StreamData } from "ai";

const MOCKED_SHARE_ID = "123456";

vi.mock("@/app/api/bot/answer-engine/answers", async () => {
	return {
		answers: {
			create: (answer: NewAnswer) => ({ ...answer, shareId: MOCKED_SHARE_ID }),
		},
	};
});

vi.spyOn(answers, "create");

describe("saveAnswer", () => {
	it("should save the answer correctly", async () => {
		const question = "What is your favorite color?";
		const isFollowUpQuestion = false;
		const slug = "favorite-color";
		const userId = "123456";

		expect(answers.create).not.toHaveBeenCalled();

		const data = {
			close: vi.fn(),
			append: vi.fn(),
		} as unknown as experimental_StreamData;

		await saveAnswer(
			question,
			isFollowUpQuestion,
			slug,
			userId,
			data,
		)(MOCKED_ANSWER_ENGINE_RUN);

		expect(answers.create).toBeCalledTimes(1);
		expect(answers.create).toBeCalledWith({
			answer: expect.any(String),
			keyConcept: expect.any(String),
			ownerId: expect.any(String),
			papers: {
				papers: [
					{
						abstract: expect.any(String),
						link: expect.any(String),
						title: expect.any(String),
					},
					{
						abstract: expect.any(String),
						link: expect.any(String),
						title: expect.any(String),
					},
				],
			},
			question: expect.any(String),
			relatedConcepts: expect.any(Array),
			slug: expect.any(String),
		});

		expect(data.append).toBeCalledTimes(1);
		expect(data.append).toBeCalledWith({
			answers: {
				shareId: MOCKED_SHARE_ID,
				answer: expect.any(String),
			},
		});

		expect(data.close).toBeCalledTimes(1);
	});
});
