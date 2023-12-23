import { cookies } from "next/headers";

export function isBeta() {
  const cookieStore = cookies();

  return !!cookieStore.get("beta");
}
