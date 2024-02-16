import { createSharePageOpenGraphImage } from "@/app/(pages)/(app)/share/[shareId]/og/create-share-page-open-graph-image";

export const runtime = "edge";

// export const alt = "My images alt text";
// export const size = { width: 1200, height: 630 };
// export const contentType = "image/png";
export async function GET(request: Request) {
  try {
    console.log({ request: request.url });
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("shareId");
    console.log({ shareId });
    if (!shareId) {
      throw new Error("No shareId provided in the url");
    }

    return await createSharePageOpenGraphImage(shareId, {
      width: 1200,
      height: 630,
    });
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
