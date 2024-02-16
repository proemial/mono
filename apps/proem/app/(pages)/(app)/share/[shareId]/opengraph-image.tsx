import { applyLinksAsSpans } from "@/app/(pages)/(app)/oa/[id]/components/panels/bot/apply-links";
import { AnswerSharingCard } from "@/app/(pages)/(app)/share/[shareId]/og/answer-sharing-card";
import { splitEachWordToSpan } from "@/app/(pages)/(app)/share/[shareId]/og/route";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "My images alt text";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
type Props = {
  params: { shareId: string };
};

export default async function SharePageOpenGraphImage({
  params: { shareId },
}: Props) {
  try {
    console.log({ shareId });
    if (!shareId) {
      throw new Error("No shareId provided in the url");
    }

    const [sharedAnswer] = await answers.getByShareId(shareId);
    if (!sharedAnswer) {
      throw new Error("no shared answer found for the given shareId");
    }

    const helveticaBold = await fetch(
      new URL(
        "../../../../../assets/fonts/helvetica/Helvetica-Bold.ttf",
        import.meta.url,
      ),
    ).then((res) => res.arrayBuffer());

    const helvetica = await fetch(
      new URL(
        "../../../../../assets/fonts/helvetica/Helvetica.ttf",
        import.meta.url,
      ),
    ).then((res) => res.arrayBuffer());

    const { content } = applyLinksAsSpans(sharedAnswer.answer);
    const contentSplittedInSpans = content.map(splitEachWordToSpan);

    return new ImageResponse(
      <AnswerSharingCard content={contentSplittedInSpans} classNameAttr="tw" />,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "helvetica",
            data: helvetica,
            weight: 400,
          },
          {
            name: "helvetica",
            data: helveticaBold,
            weight: 700,
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
