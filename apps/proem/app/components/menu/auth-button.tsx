import { UserProfile } from "@auth0/nextjs-auth0/client";
import { LogOut, LogIn } from "lucide-react";

export function AuthButton({ user }: { user?: UserProfile }) {
  return (
    <>
      {!user && (
        <LogIn
          onClick={() => (window.location.href = `/api/auth/login`)}
          className="stroke-muted-foreground"
        />
      )}
      {user && (
        <LogOut
          onClick={() => (window.location.href = `/api/auth/logout`)}
          className="stroke-muted-foreground"
        />
      )}
    </>
  );
}
