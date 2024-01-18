import { currentUser } from "@clerk/nextjs";
import { User } from "@sentry/nextjs";

export function getProfileFromUser(
  user: Awaited<ReturnType<typeof currentUser>>
) {
  const fullName = user ? `${user.firstName} ${user.lastName}` : null;
  const initials = fullName
    ? fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
    : null;
  return {
    fullName,
    initials,
  };
}
