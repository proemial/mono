import { ImageResponse } from "next/og";
import assetDark from "@/assets/bg-asset-dark.png";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const { searchParams } = new URL(url);
    const text = searchParams.has("text")
      ? searchParams.get("text")
      : "placeholder";

    const fontData = await fetch(
      new URL(
        "@/assets/fonts/helvetica/Helvetica.ttf",
        import.meta.url
      )
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          tw="flex flex-col w-full text-2xl py-23 px-32 h-full items-center justify-center text-white"
          style={{
            backgroundImage: `url("${url.protocol}//${url.host}${image(
              params.id
            )}")`,
            backgroundSize: "cover",
            backgroundRepeat: "none",
            fontFamily: "Helvetica",
          }}
        >
          <div
            tw="bg-[#2F2F2F] border border-[#3C3C3C] rounded-sm flex w-full md:items-center p-8 text-left leading-normal text-5xl"
            style={{
              // textShadow: "rgb(255, 102, 255) 0px 0px 4px",
              // overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}
          >
            {text}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Helvetica",
            data: fontData,
            style: "normal",

          },
        ],
      }
    );
  } catch (e: any) {
    return new Response("Failed to generate image", { status: 500 });
  }
}

function image(id: string) {
  const lastNum = Number(id.charAt(id.length - 1));
  if (lastNum < 3) return assetDark.src;
  if (lastNum < 6) return assetDark.src;
  return assetDark.src;
}
