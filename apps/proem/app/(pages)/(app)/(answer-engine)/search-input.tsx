"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextInput } from "@/app/components/proem-ui/text-input";

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

  return (
    <div className="relative w-full">
      <form
        className="flex flex-row items-center"
        onSubmit={
          handleSubmit
            ? handleSubmit
            : (event) => {
                event.preventDefault();
                router.push(`/search?q=${searchValue}`);
              }
        }
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
