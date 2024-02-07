"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { TextInput } from "@/app/components/proem-ui/text-input";
import { Tracker } from "@/app/components/analytics/tracker";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";

type SearchInputProps = {
  handleSubmit?: (e: any) => void;
  input?: string;
  handleInputChange?: (e: any) => void;
  disabled?: boolean;
};

// TODO: Remove logic from the component
export default function SearchInput({
  handleSubmit,
  input,
  handleInputChange,
  disabled,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const trackAndInvoke = (event: FormEvent<HTMLFormElement>) => {
    Tracker.track(analyticsKeys.ask.submit.ask, {
      text: input ? input : searchValue,
    });

    !!handleSubmit
      ? handleSubmit(event)
      : () => {
          event.preventDefault();
          router.push(`/search?q=${searchValue}`);
        };
  };

  return (
    <div className="relative w-full">
      <form
        className="flex flex-row items-center"
        onSubmit={(event) => trackAndInvoke(event)}
      >
        <TextInput
          value={input ? input : searchValue}
          onChange={
            handleInputChange
              ? handleInputChange
              : (e) => setSearchValue(e.target.value)
          }
          disabled={disabled}
        />
      </form>
    </div>
  );
}
