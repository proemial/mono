import { proemInngest } from "./client";

// import { proemInngest } from "@/inngest/client";

export const helloWorld = proemInngest.createFunction(
  // TODO!: Add the type annotation
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log("hello world!");
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  }
);
