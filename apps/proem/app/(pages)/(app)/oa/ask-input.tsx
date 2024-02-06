"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";

export function AskInput() {
  return (
    <form
      className="flex flex-row items-center"
      action="/"
      method="get"
      onSubmit={() => {
        Tracker.track("submit:read-ask");
      }}
    >
      <TextInput />
    </form>
  );
}
