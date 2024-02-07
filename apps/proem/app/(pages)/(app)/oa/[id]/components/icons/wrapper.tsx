import { ReactNode } from "react";

export function IconWrapper({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return <div className="flex gap-2 mb-1">{children}</div>;
}
