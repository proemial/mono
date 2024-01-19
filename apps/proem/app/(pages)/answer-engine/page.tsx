import SearchInput from "@/app/(pages)/answer-engine/search-input";

export const revalidate = 1;

export default async function AnswerEngine() {
  return (
    <div className="p-6">
      <SearchInput />
    </div>
  );
}

// after initial question
// https://www.perplexity.ai/search/How-does-an-xixP3tkvRTWIzJw5zzjf7g?s=u

// after follow up
// https://www.perplexity.ai/search/How-does-an-xixP3tkvRTWIzJw5zzjf7g?s=u

// after share button click
// https://www.perplexity.ai/search/How-does-an-xixP3tkvRTWIzJw5zzjf7g?s=c#96b652c3-7689-4dcb-b3cb-c3f43ca5d681

// https://www.perplexity.ai/search/How-does-an-xixP3tkvRTWIzJw5zzjf7g?s=c#55fe2042-801b-4e73-bc06-b6a3db1b709e
