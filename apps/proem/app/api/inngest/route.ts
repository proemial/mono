import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld } from "@/inngest/hello-world";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});
