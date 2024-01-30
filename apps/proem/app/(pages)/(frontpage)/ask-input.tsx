"use client";

import SearchInput from "@/app/(pages)/answer/search-input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AskInput() {
  const [searchValue, setSearchValue] = useState("");
  const Router = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO! convert to id
    Router.push(`/answer?q=${searchValue}`);
  };

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
  };

  return (
    <div className="fixed left-0 w-full bg-black bottom-14">
      <div className="w-full max-w-screen-md px-4 py-3 mx-auto">
        <SearchInput
          handleSubmit={onSubmit}
          input={searchValue}
          handleInputChange={onInputChange}
        />
      </div>
    </div>
  );
}
