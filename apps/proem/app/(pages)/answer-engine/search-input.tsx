"use client";
import { Send } from "@/app/components/icons/functional/send";
import { Button } from "@/app/components/shadcn-ui/button";
import { Input } from "@/app/components/shadcn-ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchInputProps = {
  handleSubmit?: (e: any) => void;
  input?: string;
  handleInputChange?: (e: any) => void;
};

// TODO: Remove logic from the component
export default function SearchInput({
  handleSubmit,
  input,
  handleInputChange,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  return (
    <div className="relative w-full">
      <form
        className="flex flex-row items-center break-words"
        onSubmit={
          handleSubmit
            ? handleSubmit
            : (event) => {
                event.preventDefault();
                router.push(`/search?q=${searchValue}`);
              }
        }
      >
        <Input
          type="textarea"
          placeholder="Ask anything"
          className="relative break-words stretch"
          value={input ? input : searchValue}
          onChange={
            handleInputChange
              ? handleInputChange
              : (e) => setSearchValue(e.target.value)
          }
        />
        <Button
          variant="send_button"
          size="sm"
          type="submit"
          className="absolute justify-center bg-transparent right-2"
        >
          <Send />
        </Button>
      </form>
    </div>
  );
}
