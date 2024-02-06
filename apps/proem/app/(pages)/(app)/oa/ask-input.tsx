"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

export function AskInput() {
  return (
    <form
      className="flex flex-row items-center"
      action="/"
      method="get"
      onSubmit={() => {
        Tracker.track(analyticsKeys.read.submit.ask);
      }}
    >
      <TextInput />
    </form>
  );
}
