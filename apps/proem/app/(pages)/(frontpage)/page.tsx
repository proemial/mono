import AskInput from "@/app/(pages)/(frontpage)/ask-input";
import { Button } from "@/app/components/shadcn-ui/button";

const STARTERS = [
  "Do Vaccines Cause Autism Spectrum Disorder?",
  "Is a Daily Glass of Wine Healthy?",
  "Do Cell Phones Cause Brain Cancer?",
  "What is the universe made of?",
  "How can I lower my blood pressure?",
  "What can I do for heartburn relief?",
  "Is Microwaved Food Unsafe?",
  "Why do we dream?",
];

export const revalidate = 1;

export default async function FrontPage() {
  return (
    <>
      <div className="flex flex-col mt-auto mb-5">
        <div className="flex flex-wrap gap-[6px] ">
          {STARTERS.map((starter) => (
            <Button
              key={starter}
              variant="ae_starter"
              size="sm"
              // onClick={() => {
              //   append({ role: "user", content: starter });
              // }}
            >
              {starter}
            </Button>
          ))}
        </div>
      </div>

      <AskInput />
    </>
  );
}
