import { neonDb } from "@proemial/data";
import { answers } from "@proemial/data/neon/schema/answers";
import { redirect } from "next/navigation";

type AnswerEngineRedirectProps = {
  searchParams: { q: string };
};

/**
 *  AnswerEngihne
 * @param param0
 * @returns
 */
export default async function AnswerEngineRedirect({
  searchParams: { q: question },
}: AnswerEngineRedirectProps) {
  /**
   * TODO!!!!!
   * 1) Requests from client should be initiated asap from the client without the need for a Server Componenet
   * 		- No need to call server + wait for DB lookups before starting the chat init
   * 2) After a response is made, we start saving and soft route to the /answer/id page
   * 3) Shared links lands directly on the answer page and initialMessages is parsed down as props
   * 		- No animation initially, but that is fine. Look into
   */

  console.log({
    question,
  });
  // const answer = await neonDb.query.answers.findFirst();
  const id = "xixP3tkvRTWIzJw5zzjf7g";
  // const answer = await = answers.se

  // TODO! fetch answer if exist

  // TODO! create answer if it doesn't exist

  if (id) {
    // redirect(`/answer/${id}`);
  }
  return <h1>redirect</h1>;
}
