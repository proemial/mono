"use client";

import { useUser } from "@clerk/nextjs";

export function UserClientTest() {
  const { user } = useUser();
  console.log({ userClientTest: user });

  return null;
}
