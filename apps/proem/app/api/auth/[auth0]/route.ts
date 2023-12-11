import { handleAuth, handleCallback, Session } from "@auth0/nextjs-auth0";
import base64url from "base64url";
import { NextRequest } from "next/server";

export const GET = handleAuth({
  onError(req: Request, error: Error) {
    console.error(error);
  },

  callback: handleCallback({
    afterCallback: (
      req: NextRequest,
      session: Session,
      state?: { [key: string]: any },
    ) => {
      const { sub: id } = session.user;
      const info = extractUserInfo(session);
      const email = getEmailFromToken(state?.returnTo);

      console.log("login completed", id, email, info);

      return session;
    },
  }),
});

function extractUserInfo(session: Session) {
  const { name, nickname, picture } = session.user;
  const email = session.user["https://proem.ai/email"] as string | undefined;
  const domain = email?.substring(email.indexOf("@") + 1);

  const organisations = ["proem.ai"];
  const org = domain && organisations.includes(domain) ? domain : undefined;

  return { name, nickname, picture, email, org };
}

function getEmailFromToken(returnTo?: string) {
  if (returnTo?.includes("token=")) {
    const url = new URL(returnTo);
    return base64url.decode(url.searchParams.get("token") as string);
  }
  return undefined;
}
