import Link from "next/link";
import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import { LOGIN_REDIRECT_URL_PARAM_NAME } from "@/app/components/login/login-drawer";

type Props = {
  href: string;
  authRequired?: boolean;
};

export function useLinkProps(props: Props): Parameters<typeof Link>[0] {
  const { close, open } = useDrawerState();
  const { userId } = useAuth();
  const { authRequired, href } = props;

  return userId
    ? { href }
    : {
        href: authRequired
          ? { query: { [LOGIN_REDIRECT_URL_PARAM_NAME]: href } }
          : href,
        onClick: authRequired ? open : close,
      };
}
