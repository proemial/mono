import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  // Font
  const interSemiBold = fetch(
    new URL("@/assets/fonts/helvetica/Helvetica.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        About Acme
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );

  // try {
  //   const url = new URL(request.url);
  //   const { searchParams } = new URL(url);
  //   const text = searchParams.has("text")
  //     ? searchParams.get("text")
  //     : "placeholder";

  //   const fontData = fetch(
  //     new URL(
  //       "@/assets/fonts/helvetica/Helvetica.ttf",
  //       import.meta.url
  //     )
  //   ).then((res) => res.arrayBuffer());

  //   return new ImageResponse(
  //     (
  //       <div
  //         tw="flex flex-col w-full text-2xl py-23 px-32 h-full items-center justify-center text-white"
  //         style={{
  //           backgroundImage: `url("${url.protocol}//${url.host}${image(
  //             params.id
  //           )}")`,
  //           backgroundSize: "cover",
  //           backgroundRepeat: "none",
  //           fontFamily: "Helvetica",
  //         }}
  //       >
  //         <div
  //           tw="bg-[#2F2F2F] border border-[#3C3C3C] rounded-sm flex w-full md:items-center p-8 text-left leading-normal text-5xl"
  //           style={{
  //             // textShadow: "rgb(255, 102, 255) 0px 0px 4px",
  //             // overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
  //           }}
  //         >
  //           {text}
  //         </div>
  //       </div>
  //     ),
  //     {
  //       width: 1200,
  //       height: 630,
  //       fonts: [
  //         {
  //           name: "Helvetica",
  //           data: await fontData,
  //           style: "normal",

  //         },
  //       ],
  //     }
  //   );
  // } catch (e: any) {
  //   return new Response("Failed to generate image", { status: 500 });
  // }
}
