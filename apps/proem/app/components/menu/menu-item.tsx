import React, { ReactNode } from "react";
import Link from "next/link";
import { useIsActive } from "@/app/components/menu/helpers/is-active";
import { useLinkProps } from "@/app/components/menu/helpers/link-props";

type Props = {
  text: string;
  href: string;
  children: ReactNode;
  authRequired?: boolean;
};

export function MenuItem(props: Props) {
  const { text, linkProps, children, style } = useMenuProps(props);

  return (
    <Link
      {...linkProps}
      className="p-2 cursor-pointer flex items-center"
      style={style}
    >
      {children} {text}
    </Link>
  );
}

export function useMenuProps(props: Props) {
  const active = useIsActive(props);
  const linkProps = useLinkProps(props);

  const color = active ? "#7DFA86" : "#FFFFFF80";

  return {
    ...props,
    text: active && props.text,
    style: { fill: color, stroke: color },
    linkProps,
  };
}
