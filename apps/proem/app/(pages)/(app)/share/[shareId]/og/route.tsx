import { applyLinks } from "@/app/(pages)/(app)/oa/[id]/components/panels/bot/apply-links";
import { AnswerSharingCard } from "@/app/(pages)/(app)/share/[shareId]/og/answer-sharing-card";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const shareId = request.url.split("/").at(-2);
    if (!shareId) {
      throw new Error("No shareId provided in the query string.");
    }

    const [sharedAnswer] = await answers.getByShareId(shareId);
    if (!sharedAnswer) {
      throw new Error("No shareId provided in the query string.");
    }

    const helveticaBold = await fetch(
      new URL(
        "../../../../../../assets/fonts/helvetica/Helvetica-Bold.ttf",
        import.meta.url
      )
    ).then((res) => res.arrayBuffer());

    const helvetica = await fetch(
      new URL(
        "../../../../../../assets/fonts/helvetica/Helvetica.ttf",
        import.meta.url
      )
    ).then((res) => res.arrayBuffer());

    const { content } = applyLinks(sharedAnswer.answer);
    return new ImageResponse(
      <AnswerSharingCard content={sharedAnswer.answer} classNameAttr="tw" />,
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
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
