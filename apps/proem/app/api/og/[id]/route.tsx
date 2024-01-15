import { ImageResponse } from "next/og";
import assetImg1 from "@/assets/asset-bg-1.png";
import assetImg2 from "@/assets/asset-bg-2.png";
import assetImg3 from "@/assets/asset-bg-3.png";
import proembanner from "@/assets/proembanner.webp"

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const url = new URL(request.url);
    const { searchParams } = new URL(url);
    const text = searchParams.has("text")
      ? searchParams.get("text")
      : "placeholder";

    const fontData = await fetch(
      new URL("@/assets/fonts/anek-malayalam/AnekMalayalam-SemiBold.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          tw="flex flex-col w-full h-full items-center justify-center text-white"
          style={{
            backgroundImage: `url(${proembanner.src})`,
            // backgroundImage: `url("${url.protocol}//${url.host}${image(
            //   params.id,
            // )}")`,
            backgroundSize: "cover",
            backgroundRepeat: "none",
            fontFamily: "AnekMalayalam",
          }}
        >
          <div
            tw="flex w-full md:items-center p-8 text-left text-2xl"
            style={{
              textShadow: "rgb(255, 102, 255) 0px 0px 4px",
              // overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}
          >
            {text}
          </div>
        </div>
      ),
      {
        width: 400,
        height: 200,
        fonts: [
          {
            name: "AnekMalayalam",
            data: fontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    return new Response("Failed to generate image", { status: 500 });
  }
}

function image(id: string) {
  const lastNum = Number(id.charAt(id.length - 1));
  if (lastNum < 3) return assetImg1.src;
  if (lastNum < 6) return assetImg2.src;
  return assetImg3.src;
}
